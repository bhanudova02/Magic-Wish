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
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 active:scale-95"
                >
                    <svg className="w-6 h-6" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    Continue with Google
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
