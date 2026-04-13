import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { customerAccountFetch, getCustomerProfileQuery, getCustomerOrdersQuery, customerAddressCreateMutation } from '../utils/shopify';
import { Package, User as UserIcon, LogOut, Clock, Pencil } from 'lucide-react';

const FormInput = ({ label, value, onChange }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        <input required type="text" className="w-full p-3 border border-gray-100 rounded-sm text-sm focus:outline-none focus:border-black font-medium transition-all" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
);

const AddressForm = ({ newAddress, setNewAddress, isSaving, onSave, onCancel }) => (
    <form onSubmit={onSave} className="space-y-6 max-w-lg">
        <div className="grid grid-cols-2 gap-4">
            <FormInput label="First Name" value={newAddress.firstName} onChange={(v) => setNewAddress({...newAddress, firstName: v})} />
            <FormInput label="Last Name" value={newAddress.lastName} onChange={(v) => setNewAddress({...newAddress, lastName: v})} />
        </div>
        <FormInput label="Street Address" value={newAddress.address1} onChange={(v) => setNewAddress({...newAddress, address1: v})} />
        <FormInput label="Apartment (Optional)" value={newAddress.address2} onChange={(v) => setNewAddress({...newAddress, address2: v})} />
        <div className="grid grid-cols-3 gap-4">
            <FormInput label="City" value={newAddress.city} onChange={(v) => setNewAddress({...newAddress, city: v})} />
            <FormInput label="Province" value={newAddress.province} onChange={(v) => setNewAddress({...newAddress, province: v})} />
            <FormInput label="Zip" value={newAddress.zip} onChange={(v) => setNewAddress({...newAddress, zip: v})} />
        </div>
        <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isSaving} className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 disabled:opacity-50 transition-all">
                {isSaving ? 'Saving...' : 'Add Address'}
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-500 px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm transition-all">Cancel</button>
        </div>
    </form>
);

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading: authLoading, logoutUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
    const [customerData, setCustomerData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newAddress, setNewAddress] = useState({ address1: '', address2: '', city: '', province: '', zip: '', country: 'India', firstName: '', lastName: '' });

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['profile', 'orders'].includes(tab)) setActiveTab(tab);
    }, [searchParams]);

    useEffect(() => {
        if (isAuthenticated) fetchProfileData();
    }, [isAuthenticated]);

    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            const profileRes = await customerAccountFetch({ query: getCustomerProfileQuery });
            if (profileRes?.customer) setCustomerData(profileRes.customer);
            const ordersRes = await customerAccountFetch({ query: getCustomerOrdersQuery, variables: { first: 10 } });
            if (ordersRes?.customer?.orders) setOrders(ordersRes.customer.orders.edges.map(e => e.node) || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const data = await customerAccountFetch({ query: customerAddressCreateMutation, variables: { address: newAddress } });
            if (!data.customerAddressCreate.userErrors.length) {
                setShowAddressForm(false);
                fetchProfileData();
                setNewAddress({ address1: '', address2: '', city: '', province: '', zip: '', country: 'India', firstName: '', lastName: '' });
            }
        } catch (error) {
            alert('Error saving address');
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;
    if (!isAuthenticated) return <Navigate to="/" replace />;

    // Render Logic for Orders
    const renderOrders = () => (
        <div className="space-y-12">
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            {orders.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-gray-50 rounded-sm">
                    <p className="text-gray-400 font-bold">No orders found.</p>
                    <Link to="/books" className="text-black underline underline-offset-4 mt-4 inline-block font-bold">Go To Shop</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order.id} className="border-b border-gray-50 pb-8">
                            <div className="flex justify-between items-start mb-6 text-sm">
                                <div>
                                    <h3 className="font-bold text-lg">Order #{order.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{new Date(order.processedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">{order.totalPrice.amount} {order.totalPrice.currencyCode}</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-widest mt-1 px-2 py-0.5 inline-block border ${order.financialStatus === 'PAID' ? 'border-green-100 text-green-600 bg-green-50' : 'border-gray-100 text-gray-400'}`}>{order.financialStatus}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {order.lineItems?.edges?.map(({ node: item }, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-16 h-20 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden p-1 flex-shrink-0">
                                            {item.image ? <img src={item.image.url} alt={item.title} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-200">IMG</div>}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold leading-tight line-clamp-2">{item.title}</div>
                                            <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Render Logic for Profile and Addresses
    const renderProfile = () => (
        <div className="space-y-16">
            <section>
                <h2 className="text-3xl font-bold tracking-tight mb-8">Profile</h2>
                <div className="bg-gray-50/50 p-6 md:p-8 rounded-sm">
                    <h4 className="font-bold text-lg mb-2">{customerData?.firstName} {customerData?.lastName}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-medium">{customerData?.emailAddress?.emailAddress}</p>
                </div>
            </section>

            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold">Addresses</h3>
                    {!showAddressForm && <button onClick={() => setShowAddressForm(true)} className="text-indigo-600 text-sm font-bold hover:underline">+ Add</button>}
                </div>
                {showAddressForm ? (
                    <div className="bg-white border border-gray-100 p-8 rounded-sm">
                        <AddressForm newAddress={newAddress} setNewAddress={setNewAddress} isSaving={isSaving} onSave={handleSaveAddress} onCancel={() => setShowAddressForm(false)} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(customerData?.addresses?.edges || []).map(({ node: addr }) => (
                            <div key={addr.id} className="bg-gray-50/50 p-8 rounded-sm relative group">
                                <div className="flex justify-between items-start mb-4 uppercase tracking-tighter italic">
                                    <span className="text-[10px] font-bold text-gray-400">{customerData.defaultAddress?.id === addr.id ? 'Default' : 'Address'}</span>
                                    <button className="text-gray-400 hover:text-black"><Pencil className="w-3.5 h-3.5" /></button>
                                </div>
                                <p className="text-sm font-medium leading-loose text-gray-600">
                                    {addr.firstName} {addr.lastName}<br />
                                    {addr.address1}, {addr.address2}<br />
                                    {addr.zip} {addr.city} {addr.province}<br />
                                    {addr.country}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 bg-white font-sans text-gray-900">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12 border-b border-gray-100">
                    <div className="flex gap-8">
                        {['orders', 'profile'].map((id) => (
                            <button key={id} onClick={() => { setActiveTab(id); setSearchParams({ tab: id }); }} className={`pb-4 text-sm font-bold uppercase tracking-tight transition-all border-b-2 ${activeTab === id ? 'border-black text-black' : 'border-transparent text-gray-400'}`}>{id}</button>
                        ))}
                    </div>
                    <button onClick={logoutUser} className="pb-4 text-sm font-bold text-gray-400 hover:text-black">Sign Out</button>
                </div>
                {isLoading ? <div className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest animate-pulse">Syncing...</div> : (activeTab === 'orders' ? renderOrders() : renderProfile())}
            </div>
        </div>
    );
};

export default ProfilePage;
