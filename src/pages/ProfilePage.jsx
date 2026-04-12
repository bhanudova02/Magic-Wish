import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { customerAccountFetch, getCustomerProfileQuery, getCustomerOrdersQuery } from '../utils/shopify';
import { Package, MapPin, User as UserIcon, LogOut, ChevronRight, ShoppingBag, Clock, ExternalLink } from 'lucide-react';

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading: authLoading, logoutUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [customerData, setCustomerData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfileData();
        }
    }, [isAuthenticated]);

    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            const [profileRes, ordersRes] = await Promise.all([
                customerAccountFetch({ query: getCustomerProfileQuery }),
                customerAccountFetch({ query: getCustomerOrdersQuery, variables: { first: 10 } })
            ]);
            
            setCustomerData(profileRes.customer);
            setOrders(ordersRes.customer.orders.edges.map(e => e.node));
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setIsLoading(false);
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
        { id: 'profile', label: 'Account', icon: UserIcon },
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
    ];

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 bg-gray-50/50 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-72 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
                            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {characterAvatar(user.name)}
                                </div>
                                <div className="overflow-hidden">
                                    <h2 className="font-bold text-gray-900 truncate">{user.name}</h2>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            <nav className="p-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            activeTab === tab.id 
                                            ? 'bg-blue-50 text-blue-700' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                                        {tab.label}
                                        {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                                    </button>
                                ))}
                                
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={logoutUser}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-500 font-medium">Loading your information...</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {activeTab === 'profile' && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-8 border-b border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">Account Overview</h3>
                                            <p className="text-gray-500 text-sm">Manage your personal information and account settings.</p>
                                        </div>
                                        <div className="p-8 space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium text-gray-900">
                                                        {customerData?.firstName || '—'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium text-gray-900">
                                                        {customerData?.lastName || '—'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium text-gray-900">
                                                        {customerData?.emailAddress?.emailAddress}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-medium text-gray-900">
                                                        {customerData?.phoneNumber?.phoneNumber || 'No phone linked'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-gray-50">
                                                <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                                                    Update profile details <ExternalLink className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">Order History</h3>
                                                <p className="text-gray-500 text-sm">View and track your previous purchases.</p>
                                            </div>
                                            <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold">
                                                {orders.length} Total Orders
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 md:p-8">
                                            {orders.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-500 font-medium mb-4">You haven't placed any orders yet.</p>
                                                    <Link to="/books" className="inline-flex bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
                                                        Browse Marketplace
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {orders.map((order) => (
                                                        <div key={order.id} className="group border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                                                                        <Package className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900">Order {order.name}</h4>
                                                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                                            <Clock className="w-3 h-3" />
                                                                            {new Date(order.processedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-bold text-lg text-gray-900">{order.totalPrice.amount} {order.totalPrice.currencyCode}</div>
                                                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${
                                                                        order.financialStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                                                    }`}>
                                                                        {order.financialStatus}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex flex-wrap gap-2">
                                                                {order.lineItems.edges.map((item, idx) => (
                                                                    <div key={idx} className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 p-1">
                                                                        {item.node.image ? (
                                                                            <img src={item.node.image.url} alt={item.node.title} className="w-full h-full object-contain" />
                                                                        ) : (
                                                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[8px] text-gray-400 text-center">No Image</div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                                {order.lineItems.edges.length > 5 && (
                                                                    <div className="w-16 h-20 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-xs font-bold text-gray-400">
                                                                        +{order.lineItems.edges.length - 5}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'addresses' && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">Saved Addresses</h3>
                                                <p className="text-gray-500 text-sm">Add or edit your shipping and billing addresses.</p>
                                            </div>
                                            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">
                                                Add New Address
                                            </button>
                                        </div>
                                        
                                        <div className="p-8">
                                            {!customerData?.addresses?.edges?.length ? (
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <MapPin className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-500 font-medium">You don't have any saved addresses.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {customerData.addresses.edges.map(({ node: addr }) => (
                                                        <div key={addr.id} className="relative group border border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-all">
                                                            {customerData.defaultAddress?.id === addr.id && (
                                                                <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                                    Default
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <MapPin className="w-5 h-5 text-gray-400" />
                                                                <span className="font-bold text-gray-900">Shipping Address</span>
                                                            </div>
                                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                                {addr.address1}<br />
                                                                {addr.address2 && <>{addr.address2}<br /></>}
                                                                {addr.city}, {addr.province} {addr.zip}<br />
                                                                {addr.country}
                                                            </p>
                                                            <div className="mt-6 pt-4 border-t border-gray-50 flex gap-4">
                                                                <button className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                                                                <button className="text-xs font-bold text-red-500 hover:underline">Delete</button>
                                                            </div>
                                                        </div>
                                                    ))}
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

const characterAvatar = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
};

export default ProfilePage;

