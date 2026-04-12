import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading, logoutUser } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-pulse text-gray-500 font-medium">Loading profile...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header/Cover Section */}
                    <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                    
                    {/* Profile Info Section */}
                    <div className="px-8 pb-10 relative">
                        <div className="absolute -top-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 font-medium">{user.email}</p>
                            </div>

                            <button
                                onClick={logoutUser}
                                className="px-6 py-2.5 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors self-start"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Stats/Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">
                        <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-100">
                            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Library</div>
                            <div className="text-2xl font-bold text-gray-900">0 Books</div>
                        </div>
                        <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-100">
                            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Orders</div>
                            <div className="text-2xl font-bold text-gray-900">0 Items</div>
                        </div>
                        <div className="p-8 text-center">
                            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Member Since</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 bg-blue-50/50 rounded-2xl p-6 border border-blue-100 text-center">
                    <p className="text-blue-700 font-medium">Your account is active. Start adding books to your library to see them here.</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
