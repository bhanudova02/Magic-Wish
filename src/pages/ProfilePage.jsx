import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { customerAccountFetch, getCustomerProfileQuery, getCustomerOrdersQuery, customerAddressCreateMutation } from '../utils/shopify';
import { Package, MapPin, User as UserIcon, LogOut, ChevronRight, ShoppingBag, Clock, ExternalLink, Plus, X as CloseIcon } from 'lucide-react';

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading: authLoading, logoutUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [customerData, setCustomerData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Address Form State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address1: '',
        address2: '',
        city: '',
        province: '',
        zip: '',
        country: 'United States',
        firstName: '',
        lastName: ''
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
            if (profileRes?.customer) {
                setCustomerData(profileRes.customer);
            }

            const ordersRes = await customerAccountFetch({ query: getCustomerOrdersQuery, variables: { first: 10 } });
            if (ordersRes?.customer?.orders) {
                setOrders(ordersRes.customer.orders.edges.map(e => e.node) || []);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
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

            if (data.customerAddressCreate.userErrors.length > 0) {
                alert(data.customerAddressCreate.userErrors[0].message);
            } else {
                setShowAddressForm(false);
                fetchProfileData();
                setNewAddress({
                    address1: '', address2: '', city: '', province: '', zip: '', country: 'United States', firstName: '', lastName: ''
                });
            }
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address.');
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: UserIcon },
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
    ];

    return (
        <div className="min-h-screen pt-20 pb-20 bg-gray-50/50 font-sans">
            {/* Mobile Header / User Info */}
            <div className="lg:hidden bg-white border-b border-gray-100 p-4 pt-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center text-white font-bold text-2xl">
                        {characterAvatar(user.name)}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{user.name}</h2>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Nav Tabs */}
            <div className="lg:hidden sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex overflow-x-auto no-scrollbar px-2 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setSearchParams({ tab: tab.id });
                        }}
                        className={`flex-none flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                            activeTab === tab.id 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-6 lg:mt-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
                            <div className="p-8 border-b border-gray-50 text-center">
                                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl shadow-xl shadow-blue-200 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                                    {characterAvatar(user.name)}
                                </div>
                                <h2 className="font-bold text-xl text-gray-900 truncate">{user.name}</h2>
                                <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                            </div>

                            <nav className="p-4">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setSearchParams({ tab: tab.id });
                                        }}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all mb-1 ${
                                            activeTab === tab.id 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <tab.icon className={`w-5 h-5`} />
                                        {tab.label}
                                        <ChevronRight className={`w-4 h-4 ml-auto ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                ))}
                                
                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={logoutUser}
                                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <p className="text-gray-500 font-bold tracking-tight">Syncing your account...</p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                
                                {activeTab === 'profile' && (
                                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 md:p-10 border-b border-gray-50">
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">Account Details</h3>
                                            <p className="text-gray-500 text-sm font-medium">Personal information and security settings.</p>
                                        </div>
                                        <div className="p-6 md:p-10 space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                                                <InfoBox label="First Name" value={customerData?.firstName} />
                                                <InfoBox label="Last Name" value={customerData?.lastName} />
                                                <InfoBox label="Email Address" value={customerData?.emailAddress?.emailAddress} />
                                                <InfoBox label="Phone Number" value={customerData?.phoneNumber?.phoneNumber || 'No phone linked'} />
                                            </div>

                                            <div className="pt-8 border-t border-gray-50">
                                                <button className="inline-flex items-center gap-2 text-blue-600 font-black text-sm group">
                                                    Update Information 
                                                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-2xl font-black text-gray-900">Purchase History</h3>
                                            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                                                {orders.length} Orders
                                            </span>
                                        </div>

                                        {orders.length === 0 ? (
                                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                                                </div>
                                                <p className="text-gray-900 font-black text-xl mb-2">No orders yet</p>
                                                <p className="text-gray-500 mb-8 max-w-xs mx-auto">Explore our marketplace and start your magical journey today!</p>
                                                <Link to="/books" className="inline-flex bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                                    Browse Books
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-6">
                                                {orders.map((order) => (
                                                    <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition-all">
                                                        {/* Order Header */}
                                                        <div className="p-5 md:p-8 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
                                                                    <Package className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-black text-gray-900">#{order.name}</h4>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-tight">
                                                                        <Clock className="w-3 h-3" />
                                                                        {new Date(order.processedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <div className="font-black text-xl text-gray-900">{order.totalPrice.amount} {order.totalPrice.currencyCode}</div>
                                                                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mt-1 ${
                                                                    order.financialStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                    {order.financialStatus}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Line Items */}
                                                        <div className="p-5 md:p-8 space-y-4">
                                                            {order.lineItems?.edges?.map(({ node: item }, idx) => (
                                                                <div key={idx} className="flex gap-4 md:gap-6 group">
                                                                    <div className="w-16 h-20 md:w-20 md:h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-1.5 transition-transform group-hover:scale-105">
                                                                        {item.image?.url ? (
                                                                            <img 
                                                                                src={item.image.url} 
                                                                                alt={item.image.altText || item.title} 
                                                                                className="w-full h-full object-contain" 
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 text-center font-bold">BOOKS</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 py-1">
                                                                        <h5 className="font-black text-gray-900 text-sm md:text-base leading-snug mb-1">{item.title}</h5>
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-xs font-bold text-gray-400">Qty: {item.quantity}</span>
                                                                            <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                                            <span className="text-xs font-black text-blue-600">Verified Purchase</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'addresses' && (
                                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 md:p-10 border-b border-gray-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-1">Addresses</h3>
                                                <p className="text-gray-500 text-sm font-medium">Manage your delivery destinations.</p>
                                            </div>
                                            {!showAddressForm && (
                                                <button 
                                                    onClick={() => setShowAddressForm(true)}
                                                    className="bg-blue-600 text-white p-3 rounded-2xl lg:px-6 lg:py-3 lg:text-sm font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2"
                                                >
                                                    <Plus className="w-5 h-5" /><span className="hidden lg:inline">Add New</span>
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="p-6 md:p-10">
                                            {showAddressForm ? (
                                                <AddressForm 
                                                    newAddress={newAddress} 
                                                    setNewAddress={setNewAddress} 
                                                    isSaving={isSaving} 
                                                    onSave={handleSaveAddress} 
                                                    onCancel={() => setShowAddressForm(false)} 
                                                />
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {!customerData?.addresses?.edges?.length ? (
                                                        <div className="col-span-full text-center py-10 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                                            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                                            <p className="text-gray-400 font-bold">No addresses found</p>
                                                        </div>
                                                    ) : (
                                                        customerData.addresses.edges.map(({ node: addr }) => (
                                                            <AddressCard key={addr.id} addr={addr} isDefault={customerData.defaultAddress?.id === addr.id} />
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
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

// Sub-components for cleaner code
const InfoBox = ({ label, value }) => (
    <div className="group">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-blue-600 transition-colors">
            {label}
        </label>
        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 font-black text-gray-900 group-hover:bg-white group-hover:border-blue-100 transition-all">
            {value || '—'}
        </div>
    </div>
);

const AddressCard = ({ addr, isDefault }) => (
    <div className="relative border border-gray-100 rounded-3xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/50 transition-all bg-white">
        {isDefault && (
            <div className="absolute top-6 right-6 bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                DEFAULT
            </div>
        )}
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5" />
            </div>
            <span className="font-black text-gray-900">Home Address</span>
        </div>
        <p className="text-gray-500 text-sm font-bold leading-relaxed">
            {addr.address1}<br />
            {addr.address2 && <>{addr.address2}<br /></>}
            {addr.city}, {addr.province} {addr.zip}<br />
            <span className="text-gray-900">{addr.country}</span>
        </p>
        <div className="mt-8 pt-5 border-t border-gray-50 flex gap-6">
            <button className="text-xs font-black text-blue-600 uppercase tracking-wider hover:underline">Edit</button>
            <button className="text-xs font-black text-red-400 uppercase tracking-wider hover:underline">Remove</button>
        </div>
    </div>
);

const AddressForm = ({ newAddress, setNewAddress, isSaving, onSave, onCancel }) => (
    <form onSubmit={onSave} className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="First Name" value={newAddress.firstName} onChange={(v) => setNewAddress({...newAddress, firstName: v})} />
            <FormInput label="Last Name" value={newAddress.lastName} onChange={(v) => setNewAddress({...newAddress, lastName: v})} />
        </div>
        <FormInput label="Address Line 1" value={newAddress.address1} onChange={(v) => setNewAddress({...newAddress, address1: v})} />
        <FormInput label="Address Line 2 (Optional)" value={newAddress.address2} onChange={(v) => setNewAddress({...newAddress, address2: v})} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput label="City" value={newAddress.city} onChange={(v) => setNewAddress({...newAddress, city: v})} />
            <FormInput label="Province / State" value={newAddress.province} onChange={(v) => setNewAddress({...newAddress, province: v})} />
            <FormInput label="Zip Code" value={newAddress.zip} onChange={(v) => setNewAddress({...newAddress, zip: v})} />
        </div>
        <div className="pt-6 flex gap-4">
            <button type="submit" disabled={isSaving} className="flex-1 lg:flex-none lg:px-12 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition disabled:opacity-50">
                {isSaving ? 'Processing...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 lg:flex-none lg:px-8 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black hover:bg-gray-200 transition">
                Cancel
            </button>
        </div>
    </form>
);

const FormInput = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        <input 
            required
            type="text" 
            placeholder={placeholder}
            className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const characterAvatar = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
};

export default ProfilePage;
