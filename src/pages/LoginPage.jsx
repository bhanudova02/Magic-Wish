import React from 'react';
import { getAuthorizeUrl } from '../utils/auth';

const LoginPage = () => {
    const handleLogin = async () => {
        try {
            const url = await getAuthorizeUrl();
            window.location.href = url;
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to initiate login. Please try again.');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
            <div className="max-w-md w-full bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white p-8 text-center">
                <div className="mb-6">
                    <img 
                        src="/assets/vite.svg" 
                        alt="MagicWish Logo" 
                        className="w-16 h-16 mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to MagicWish</h1>
                    <p className="text-gray-600 mt-2">Sign in to sync your library and orders across all your devices.</p>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 border border-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-300 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" x2="3" y1="12" y2="12"/>
                    </svg>
                    Sign In / Register
                </button>

                <div className="mt-8 pt-6 border-t border-gray-100 italic text-sm text-gray-500">
                    Your personal information is handled safely according to our Privacy Policy.
                </div>
            </div>
            
            <p className="mt-8 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} MagicWish. All rights reserved.
            </p>
        </div>
    );
};

export default LoginPage;
