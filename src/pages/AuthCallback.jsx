import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeCodeForToken } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const state = params.get('state');

            // Verify state to prevent CSRF
            const storedState = localStorage.getItem('shopify_auth_state');
            
            // If there's no stored state but we've already cleaned up (like on page refresh)
            if (!storedState && !state) {
                 navigate('/');
                 return;
            }

            if (state !== storedState) {
                // If it mismatches but we have already logged in, safely redirect back
                if (!storedState) {
                     navigate('/');
                     return;
                }
                setError('Security state mismatch. Please try logging in again.');
                return;
            }

            if (code) {
                try {
                    const tokens = await exchangeCodeForToken(code);
                    loginUser(tokens);
                    
                    // Cleanup session storage
                    localStorage.removeItem('shopify_auth_state');
                    localStorage.removeItem('shopify_code_verifier');
                    localStorage.removeItem('shopify_auth_nonce');

                    // Redirect back to home after successful login
                    navigate('/');
                } catch (err) {
                    console.error('Token exchange failed:', err);
                    setError('Failed to complete login. Please try again.');
                }
            } else {
                setError('No authorization code found.');
            }
        };

        handleCallback();
    }, [location, navigate, loginUser]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4 p-4 text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-800">Authentication Error</h1>
                <p className="text-gray-600 max-w-sm">{error}</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h1 className="text-xl font-medium text-gray-700">Verifying your account...</h1>
            <p className="text-gray-500 mt-2">Almost there! Please don't close this window.</p>
        </div>
    );
};

export default AuthCallback;
