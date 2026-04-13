import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { customerAccountFetch, getCustomerProfileQuery, getCustomerOrdersQuery, customerAddressCreateMutation } from '../utils/shopify';
import { Package, MapPin, User as UserIcon, LogOut, ShoppingBag, Clock, ExternalLink, Plus, X as CloseIcon } from 'lucide-react';

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading: authLoading, logoutUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [customerData, setCustomerData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address1: '', address2: '', city: '', province: '', zip: '', country: 'United States', firstName: '', lastName: ''
    });

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['profile', 'orders', 'addresses'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfileData();
        }
    }, [isAuthenticated]);

    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            const profileRes = await customerAccountFetch({ query: getCustomerProfileQuery });
            if (profileRes?.customer) setCustomerData(profileRes.customer);

            const ordersRes = await customerAccountFetch({ query: getCustomerOrdersQuery, variables: { first: 10 } });
            if (ordersRes?.customer?.orders) {
                setOrders(ordersRes.customer.orders.edges.map(e => e.node) || []);
            }
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
            const data = await customerAccountFetch({
                query: customerAddressCreateMutation,
                variables: { address: newAddress }
            });
            if (!data.customerAddressCreate.userErrors.length) {
                setShowAddressForm(false);
                fetchProfileData();
            }
        } catch (error) {
            alert('Failed to save address.');
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;
    if (!isAuthenticated) return <Navigate to="/" replace />;

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: UserIcon },
        { id: 'orders', label: 'Order History', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
    ];

    return (
        <div className="min-h-screen pt-20 pb-10 bg-white font-sans text-gray-900 px-4">
            <div className="max-w-5xl mx-auto mt-8">
                {/* Header Side-by-Side on Desktop, Stacked on Mobile */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-6 mb-8 border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-tight">Account Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Hello, {user.name}. Welcome back!</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Simplified Sidebar / Nav */}
                    <div className="w-full lg:w-56 shrink-0">
                        <nav className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar border-b lg:border-none border-gray-100 mb-6 lg:mb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setSearchParams({ tab: tab.id });
                                    }}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 lg:border-b-0 lg:border-l-4 ${
                                        activeTab === tab.id 
                                        ? 'border-black text-black bg-gray-50 lg:bg-transparent' 
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                            <button
                                onClick={logoutUser}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-500 whitespace-nowrap lg:mt-4"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="py-20 text-center text-gray-400 text-sm font-bold uppercase tracking-widest italic">Loading...</div>
                        ) : (
                            <div>
                                {activeTab === 'profile' && (
                                    <div className="border border-gray-100 rounded-sm p-6 md:p-8">
                                        <h2 className="text-lg font-bold mb-6 border-b border-gray-50 pb-4">Personal Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            <DetailItem label="Full Name" value={`${customerData?.firstName || ''} ${customerData?.lastName || ''}`.trim() || '—'} />
                                            <DetailItem label="Email" value={customerData?.emailAddress?.emailAddress} />
                                            <DetailItem label="Phone" value={customerData?.phoneNumber?.phoneNumber || 'Not provided'} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div className="space-y-6">
                                        {orders.length === 0 ? (
                                            <div className="border border-gray-100 rounded-sm p-12 text-center text-gray-400 font-bold uppercase py-24 italic">No orders found</div>
                                        ) : (
                                            orders.map((order) => (
                                                <div key={order.id} className="border border-gray-100 rounded-sm overflow-hidden">
                                                    <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                                        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                                                            <span>Order #{order.name}</span>
                                                            <span className="hidden md:inline">|</span>
                                                            <span>{new Date(order.processedAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-sm font-bold">{order.totalPrice.amount} {order.totalPrice.currencyCode}</div>
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                                                                order.financialStatus === 'PAID' ? 'border-green-200 text-green-600 bg-green-50' : 'border-gray-200 text-gray-500'
                                                            }`}>{order.financialStatus}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 space-y-4">
                                                        {order.lineItems?.edges?.map(({ node: item }, idx) => (
                                                            <div key={idx} className="flex gap-4 items-center">
                                                                <div className="w-12 h-16 bg-gray-50 border border-gray-100 rounded-sm flex-shrink-0 p-1">
                                                                    {item.image ? (
                                                                        <img src={item.image.url} alt={item.title} className="w-full h-full object-contain" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300">BOOKS</div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold leading-tight">{item.title}</div>
                                                                    <div className="text-[10px] uppercase font-bold text-gray-400 mt-1">Quantity: {item.quantity}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'addresses' && (
                                    <div className="border border-gray-100 rounded-sm p-6 md:p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <h2 className="text-lg font-bold">Shipping Addresses</h2>
                                            {!showAddressForm && (
                                                <button onClick={() => setShowAddressForm(true)} className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:text-blue-600">New Address</button>
                                            )}
                                        </div>

                                        {showAddressForm ? (
                                            <AddressForm newAddress={newAddress} setNewAddress={setNewAddress} isSaving={isSaving} onSave={handleSaveAddress} onCancel={() => setShowAddressForm(false)} />
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {!customerData?.addresses?.edges?.length ? (
                                                    <div className="col-span-full py-12 text-center text-gray-300 font-bold uppercase italic border border-dashed border-gray-100 rounded-sm">No addresses saved</div>
                                                ) : (
                                                    customerData.addresses.edges.map(({ node: addr }) => (
                                                        <div key={addr.id} className="border border-gray-100 p-6 rounded-sm relative">
                                                            {customerData.defaultAddress?.id === addr.id && <span className="absolute top-4 right-4 text-[9px] font-bold bg-gray-900 text-white px-1.5 py-0.5 tracking-tighter rounded-sm">DEFAULT</span>}
                                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                                {addr.address1}<br />
                                                                {addr.address2 && <>{addr.address2}<br /></>}
                                                                {addr.city}, {addr.province} {addr.zip}<br />
                                                                {addr.country}
                                                            </p>
                                                            <div className="mt-4 pt-4 border-t border-gray-50 flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                                                                <button className="underline">Edit</button>
                                                                <button className="text-red-500 underline">Delete</button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
        <div className="text-sm font-bold text-gray-900 underline underline-offset-4 decoration-gray-100">{value}</div>
    </div>
);

const AddressForm = ({ newAddress, setNewAddress, isSaving, onSave, onCancel }) => (
    <form onSubmit={onSave} className="space-y-6 max-w-lg">
        <div className="grid grid-cols-2 gap-4">
            <FormInput label="First Name" value={newAddress.firstName} onChange={(v) => setNewAddress({...newAddress, firstName: v})} />
            <FormInput label="Last Name" value={newAddress.lastName} onChange={(v) => setNewAddress({...newAddress, lastName: v})} />
        </div>
        <FormInput label="Street Address" value={newAddress.address1} onChange={(v) => setNewAddress({...newAddress, address1: v})} />
        <FormInput label="Apartment / Suite" value={newAddress.address2} onChange={(v) => setNewAddress({...newAddress, address2: v})} />
        <div className="grid grid-cols-3 gap-4">
            <FormInput label="City" value={newAddress.city} onChange={(v) => setNewAddress({...newAddress, city: v})} />
            <FormInput label="Province" value={newAddress.province} onChange={(v) => setNewAddress({...newAddress, province: v})} />
            <FormInput label="Zip" value={newAddress.zip} onChange={(v) => setNewAddress({...newAddress, zip: v})} />
        </div>
        <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isSaving} className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 disabled:opacity-50">
                {isSaving ? 'Processing...' : 'Save Address'}
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-500 px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm">Cancel</button>
        </div>
    </form>
);

const FormInput = ({ label, value, onChange }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        <input required type="text" className="w-full p-2.5 border border-gray-100 rounded-sm text-sm focus:outline-none focus:border-black font-medium" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
);

export default ProfilePage;
