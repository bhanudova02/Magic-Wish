import React, { createContext, useState, useContext, useEffect } from 'react';
import { shopifyFetch, cartCreateMutation } from '../utils/shopify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    
    // Store user ID to manage account transitions and avoid data leaks
    const lastUserIdRef = React.useRef(user?.id);
    const getCartKey = (u) => u?.id ? `magicwish_cart_${u.id}` : 'magicwish_cart_guest';

    // 1. Initial Load & Account Switching
    useEffect(() => {
        const key = getCartKey(user);
        const savedCart = localStorage.getItem(key);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
        lastUserIdRef.current = user?.id;
    }, [user?.id]);

    // 2. Persistent Saving (Sync current state to current account key)
    useEffect(() => {
        if (lastUserIdRef.current === user?.id) {
            const key = getCartKey(user);
            localStorage.setItem(key, JSON.stringify(cartItems));
        }
    }, [cartItems, user?.id]);

    useEffect(() => {
        const handleCheckPendingCheckout = () => {
            const pendingCheckout = localStorage.getItem('magicwish_pending_checkout');
            if (pendingCheckout === 'true') {
                setCartItems([]);
                localStorage.removeItem('magicwish_pending_checkout');
                // Clear the specific user's cart after returning from checkout
                localStorage.removeItem(getCartKey(user));
            }
        };

        // Initial check on mount
        handleCheckPendingCheckout();

        // Check again when page becomes visible or is shown from cache (back button)
        window.addEventListener('pageshow', handleCheckPendingCheckout);
        window.addEventListener('focus', handleCheckPendingCheckout);

        return () => {
            window.removeEventListener('pageshow', handleCheckPendingCheckout);
            window.removeEventListener('focus', handleCheckPendingCheckout);
        };
    }, []);



    const addToCart = (product) => {
        if (!product.variantId) {
            console.error("Cannot add item to cart: Missing variantId", product);
            return;
        }
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Open drawer when item added
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.priceAmount ?? parseFloat(item.price?.replace('$', '') || '0');
            return isNaN(price) ? total : total + (price * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const checkout = async () => {
        if (cartItems.length === 0 || isCheckingOut) return;
        
        setIsCheckingOut(true);
        try {
            const lines = cartItems
                .filter(item => item.variantId)
                .map(item => ({
                    merchandiseId: item.variantId,
                    quantity: item.quantity
                }));

            if (lines.length === 0) {
                throw new Error("No valid products found in cart. Please try re-adding items.");
            }

            const variables = {
                input: {
                    lines: lines
                }
            };

            // If user is logged in, pass their email as buyer identity
            if (user && user.email) {
                variables.input.buyerIdentity = {
                    email: user.email
                };
            }

            const data = await shopifyFetch({
                query: cartCreateMutation,
                variables: variables
            });

            if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
                throw new Error(data.cartCreate.userErrors[0].message);
            }

            const checkoutUrl = data.cartCreate.cart.checkoutUrl;
            
            // Set flag to clear cart on next load (so it's empty if they come back)
            // but keep it for now so there's no UI flash before redirect
            localStorage.setItem('magicwish_pending_checkout', 'true');

            window.location.href = checkoutUrl;
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed: " + (error.message || "Please try again."));
        } finally {
            // We don't set isCheckingOut to false if redirecting, 
            // but in case of error we should.
            setIsCheckingOut(false);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                setIsCartOpen,
                isCheckingOut,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                checkout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
