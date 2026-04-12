import React, { createContext, useState, useContext, useEffect } from 'react';
import { shopifyFetch, cartCreateMutation } from '../utils/shopify';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('magicwish_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        localStorage.setItem('magicwish_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
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
            const price = parseFloat(item.price.replace('$', ''));
            return total + price * item.quantity;
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

            const data = await shopifyFetch({
                query: cartCreateMutation,
                variables: {
                    input: {
                        lines: lines
                    }
                }
            });

            if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
                throw new Error(data.cartCreate.userErrors[0].message);
            }

            const checkoutUrl = data.cartCreate.cart.checkoutUrl;
            // Optionally clear cart here, but it's safer to let the user return if they cancel
            // clearCart(); 
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
