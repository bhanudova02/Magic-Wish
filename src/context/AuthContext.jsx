import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearAuthStorage, getValidCustomerAccessToken, persistAuthTokens } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('shopify_access_token'));

    useEffect(() => {
        let isMounted = true;

        const restoreSession = async () => {
            const storedUser = localStorage.getItem('shopify_user');

            if (!storedUser) {
                if (isMounted) setIsLoading(false);
                return;
            }

            try {
                const token = await getValidCustomerAccessToken();
                const parsedUser = JSON.parse(storedUser);

                if (isMounted) {
                    setUser(parsedUser);
                    setAccessToken(token);
                }
            } catch (error) {
                console.error('Error restoring Shopify session:', error);
                clearAuthStorage();

                if (isMounted) {
                    setUser(null);
                    setAccessToken(null);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const handleAuthExpired = () => {
            clearAuthStorage();
            setUser(null);
            setAccessToken(null);
        };

        restoreSession();
        window.addEventListener('magicwish-auth-expired', handleAuthExpired);

        return () => {
            isMounted = false;
            window.removeEventListener('magicwish-auth-expired', handleAuthExpired);
        };
    }, []);

    const loginUser = (tokens) => {
        const { access_token, id_token } = tokens;
        
        // Decode ID Token (JWT) to get user info
        try {
            const payload = JSON.parse(atob(id_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            const userData = {
                id: payload.sub,
                email: payload.email,
                name: payload.name || payload.email.split('@')[0],
            };
            
            setUser(userData);
            setAccessToken(access_token);
            
            persistAuthTokens(tokens);
            localStorage.setItem('shopify_user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error decoding ID token:', error);
        }
    };

    const logoutUser = () => {
        const idToken = localStorage.getItem('shopify_id_token');
        setUser(null);
        setAccessToken(null);
        clearAuthStorage();
        // Removed: localStorage.removeItem('magicwish_cart'); 
        // We now use account-specific keys for persistence.
        
        if (idToken) {
            // Redirect to Shopify logout endpoint so it clears the server session
            const shopId = import.meta.env.VITE_SHOPIFY_SHOP_ID;
            window.location.href = `https://shopify.com/authentication/${shopId}/logout?id_token_hint=${idToken}`;
        } else {
            window.location.href = '/'; // Hard reload if no tokens found
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, isLoading, loginUser, logoutUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
