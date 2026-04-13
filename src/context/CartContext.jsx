import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
    shopifyFetch, 
    cartCreateMutation, 
    getCartQuery, 
    cartLinesAddMutation, 
    cartLinesUpdateMutation, 
    cartLinesRemoveMutation 
} from '../utils/shopify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user, accessToken } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartCost, setCartCost] = useState({ subtotalAmount: { amount: "0.0", currencyCode: "USD" } });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSynchronizing, setIsSynchronizing] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState(null);

    // Get the storage key for cart ID based on account context
    const getCartIdKey = useCallback((u) => u?.id ? `shopify_cart_id_${u.id}` : 'shopify_cart_id_guest', []);

    // Helper: Map Shopify Cart Line nodes to our app's internal item format
    const formatCartLines = (lines) => {
        return lines.edges.map(({ node }) => {
            const variant = node.merchandise;
            return {
                id: node.id, // We use the lineId for updates/removes
                productId: variant.product.handle, 
                variantId: variant.id,
                title: variant.product.title,
                image: variant.product.images.edges[0]?.node?.url || '',
                price: `$${variant.price.amount}`,
                priceAmount: parseFloat(variant.price.amount),
                currencyCode: variant.price.currencyCode,
                quantity: node.quantity,
                handle: variant.product.handle
            };
        });
    };

    // Load or Create Cart from Shopify
    const fetchOrCreateCart = useCallback(async () => {
        setIsSynchronizing(true);
        try {
            let cartId = localStorage.getItem(getCartIdKey(user));
            let data;

            if (cartId) {
                const res = await shopifyFetch({ query: getCartQuery, variables: { cartId } });
                if (res?.cart) {
                    data = res.cart;
                } else {
                    cartId = null;
                }
            }

            if (!cartId) {
                const input = {};
                if (accessToken) {
                    input.buyerIdentity = { customerAccessToken: accessToken };
                }
                const res = await shopifyFetch({ query: cartCreateMutation, variables: { input } });
                data = res.cartCreate.cart;
                localStorage.setItem(getCartIdKey(user), data.id);
            }

            if (data) {
                setCartItems(formatCartLines(data.lines));
                setCartCost(data.cost);
                setCheckoutUrl(data.checkoutUrl);
            }
        } catch (error) {
            console.error("Error syncing cart with Shopify:", error);
        } finally {
            setIsSynchronizing(false);
        }
    }, [user, accessToken, getCartIdKey]);

    useEffect(() => {
        fetchOrCreateCart();
    }, [fetchOrCreateCart]);

    useEffect(() => {
        const handleCheckPendingCheckout = () => {
            const pendingCheckout = localStorage.getItem('magicwish_pending_checkout');
            if (pendingCheckout === 'true') {
                localStorage.removeItem('magicwish_pending_checkout');
                // Cycle the cart ID to ensure a fresh cart
                localStorage.removeItem(getCartIdKey(user));
                fetchOrCreateCart();
            }
        };

        handleCheckPendingCheckout();
        window.addEventListener('pageshow', handleCheckPendingCheckout);
        window.addEventListener('focus', handleCheckPendingCheckout);
        return () => {
            window.removeEventListener('pageshow', handleCheckPendingCheckout);
            window.removeEventListener('focus', handleCheckPendingCheckout);
        };
    }, [user, getCartIdKey, fetchOrCreateCart]);



    const addToCart = async (product) => {
        if (!product.variantId) return;
        setIsSynchronizing(true);
        try {
            const cartId = localStorage.getItem(getCartIdKey(user));
            const res = await shopifyFetch({ 
                query: cartLinesAddMutation, 
                variables: { 
                    cartId, 
                    lines: [{ merchandiseId: product.variantId, quantity: 1 }] 
                } 
            });
            
            if (res.cartLinesAdd.userErrors?.length > 0) throw new Error(res.cartLinesAdd.userErrors[0].message);
            
            await fetchOrCreateCart();
            setIsCartOpen(true);
        } catch (error) {
            console.error("Add to cart failed:", error);
            alert("Failed to add item. Please try again.");
        } finally {
            setIsSynchronizing(false);
        }
    };

    const removeFromCart = async (lineId) => {
        setIsSynchronizing(true);
        try {
            const cartId = localStorage.getItem(getCartIdKey(user));
            await shopifyFetch({ 
                query: cartLinesRemoveMutation, 
                variables: { cartId, lineIds: [lineId] } 
            });
            await fetchOrCreateCart();
        } catch (error) {
            console.error("Remove from cart failed:", error);
        } finally {
            setIsSynchronizing(false);
        }
    };

    const updateQuantity = async (lineId, newQuantity) => {
        if (newQuantity < 1) {
            await removeFromCart(lineId);
            return;
        }
        setIsSynchronizing(true);
        try {
            const cartId = localStorage.getItem(getCartIdKey(user));
            await shopifyFetch({ 
                query: cartLinesUpdateMutation, 
                variables: { 
                    cartId, 
                    lines: [{ id: lineId, quantity: newQuantity }] 
                } 
            });
            await fetchOrCreateCart();
        } catch (error) {
            console.error("Update quantity failed:", error);
        } finally {
            setIsSynchronizing(false);
        }
    };

    const clearCart = async () => {
        localStorage.removeItem(getCartIdKey(user));
        await fetchOrCreateCart();
    };

    const getCartTotal = () => parseFloat(cartCost.subtotalAmount.amount);
    const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0);

    const checkout = () => {
        if (checkoutUrl) {
            localStorage.setItem('magicwish_pending_checkout', 'true');
            window.location.href = checkoutUrl;
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                setIsCartOpen,
                isCheckingOut: isSynchronizing,
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
