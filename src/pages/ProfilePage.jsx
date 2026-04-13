import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { customerAccountFetch, getCustomerProfileQuery, getCustomerOrdersQuery, customerAddressCreateMutation } from '../utils/shopify';
import { Package, User as UserIcon, LogOut, ShoppingBag, Clock, Plus, Pencil } from 'lucide-react';

const FormInput = ({ label, value, onChange }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        <input 
            required 
            type="text" 
            className="w-full p-2.5 border-2 border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black font-medium" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
        />
    </div>
);

const AddressForm = ({ newAddress, setNewAddress, isSaving, onSave, onCancel }) => (
    <form onSubmit={onSave} className="space-y-6 max-w-lg animate-in fade-in duration-300">
        <div className="grid grid-cols-2 gap-4">
            <FormInput label="First Name" value={newAddress.firstName} onChange={(v) => setNewAddress({...newAddress, firstName: v})} />
            <FormInput label="Last Name" value={newAddress.lastName} onChange={(v) => setNewAddress({...newAddress, lastName: v})} />
        </div>
        <FormInput label="Street Address" value={newAddress.address1} onChange={(v) => setNewAddress({...newAddress, address1: v})} />
        <FormInput label="Apartment / Suite" value={newAddress.address2} onChange={(v) => setNewAddress({...newAddress, address2: v})} />
        <div className="grid grid-cols-3 gap-4">
            <FormInput label="City" value={newAddress.city} onChange={(v) => setNewAddress({...newAddress, city: v})} />
            <FormInput label="Province" value={newAddress.province} onChange={(v) => setNewAddress({...newAddress, province: v})} />
            <FormInput label="Zip Code" value={newAddress.zip} onChange={(v) => setNewAddress({...newAddress, zip: v})} />
        </div>
        <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isSaving} className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Add New Address'}
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-500 px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm">Cancel</button>
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

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin"></div></div>;
    if (!isAuthenticated) return <Navigate to="/" replace />;

    const renderOrdersTab = () => (
        <div className="space-y-10">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Purchase History</h2>
            {orders.length === 0 ? (
                <div className="py-24 text-center border-2 border-gray-200 rounded-sm bg-gray-50/20">
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">No orders found</p>
                    <Link to="/books" className="text-black underline underline-offset-4 mt-4 inline-block font-bold">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border-2 border-gray-200 rounded-sm">
                            <div className="p-4 bg-gray-50/50 flex justify-between items-center border-b-2 border-gray-200">
                                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">
                                    <span>#{order.name}</span>
                                    <span>{new Date(order.processedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-sm tracking-tight">{order.totalPrice.amount} {order.totalPrice.currencyCode}</span>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 ${order.financialStatus === 'PAID' ? 'border-green-100 text-green-600 bg-green-50' : 'border-gray-200 text-gray-400'}`}>{order.financialStatus}</span>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {order.lineItems?.edges?.map(({ node: item }, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-12 h-16 bg-white border-2 border-gray-200 rounded-sm flex-shrink-0 p-1">
                                            {item.image ? <img src={item.image.url} alt={item.title} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-200 uppercase">img</div>}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold leading-tight">{item.title}</div>
                                            <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Qty: {item.quantity}</div>
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

    const renderProfileTab = () => (
        <div className="space-y-16">
            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Personal Information</h2>
                <div className="p-6 border-2 border-gray-200 rounded-sm space-y-6">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                        <p className="text-sm font-bold">{customerData?.firstName} {customerData?.lastName}</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                        <p className="text-sm font-bold break-all underline decoration-gray-200 underline-offset-2 underline-offset-4">{customerData?.emailAddress?.emailAddress}</p>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold uppercase tracking-tighter">Shipping Addresses</h3>
                    {!showAddressForm && <button onClick={() => setShowAddressForm(true)} className="text-[10px] font-bold uppercase tracking-widest border-2 border-black px-4 py-1.5 hover:bg-black hover:text-white transition-all">+ Add New</button>}
                </div>
                {showAddressForm ? (
                    <div className="p-8 border-2 border-gray-200 rounded-sm">
                        <AddressForm newAddress={newAddress} setNewAddress={setNewAddress} isSaving={isSaving} onSave={handleSaveAddress} onCancel={() => setShowAddressForm(false)} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(customerData?.addresses?.edges || []).map(({ node: addr }) => (
                            <div key={addr.id} className="p-6 border-2 border-gray-200 rounded-sm relative group hover:border-black transition-all">
                                <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-black">
                                    {customerData.defaultAddress?.id === addr.id ? 'Default' : 'Regular'}
                                </span>
                                <div className="space-y-1 text-sm font-medium text-gray-600 leading-relaxed">
                                    <p className="font-bold text-black mb-2">{addr.firstName} {addr.lastName}</p>
                                    <p>{addr.address1}</p>
                                    {addr.address2 && <p>{addr.address2}</p>}
                                    <p>{addr.city}, {addr.province} {addr.zip}</p>
                                    <p className="text-black uppercase">{addr.country}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t-2 border-gray-50 flex gap-4 text-[9px] font-bold uppercase tracking-widest">
                                    <button className="underline opacity-50 hover:opacity-100">Edit</button>
                                    <button className="underline text-red-500 opacity-50 hover:opacity-100">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );

    const tabs = [
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'profile', label: 'Profile', icon: UserIcon }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-white font-sans text-gray-900">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12 border-b-2 border-gray-200">
                    <div className="flex gap-8">
                        {tabs.map((tab) => (
                            <button 
                                key={tab.id} 
                                onClick={() => { setActiveTab(tab.id); setSearchParams({ tab: tab.id }); }} 
                                className={`pb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {/* Sign Out hidden on mobile, visible on desktop */}
                    <button onClick={logoutUser} className="hidden lg:flex pb-4 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-black items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
                {isLoading ? (
                    <div className="py-24 text-center text-gray-300 font-bold uppercase text-[10px] tracking-[0.2em] italic">Syncing Data...</div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                        {activeTab === 'orders' ? renderOrdersTab() : renderProfileTab()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
