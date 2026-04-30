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

const getAttributeValue = (attributes = [], key) => {
    return attributes.find((attr) => attr.key === key)?.value || '';
};

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
            const generatedCoverImage = getAttributeValue(node.attributes, 'AI Cover URL');

            return {
                id: node.id, // We use the lineId for updates/removes
                productId: variant.product.handle, 
                variantId: variant.id,
                title: variant.product.title,
                image: generatedCoverImage || variant.product.images.edges[0]?.node?.url || '',
                price: `$${variant.price.amount}`,
                priceAmount: parseFloat(variant.price.amount),
                currencyCode: variant.price.currencyCode,
                quantity: node.quantity,
                handle: variant.product.handle,
                attributes: node.attributes || []
            };
        });
    };

    // Load or Create Cart from Shopify
    const fetchOrCreateCart = useCallback(async () => {
        setIsSynchronizing(true);
        try {
            let cartId = localStorage.getItem(getCartIdKey(user));
            let data = null;

            if (cartId) {
                try {
                    const res = await shopifyFetch({ query: getCartQuery, variables: { cartId } });
                    if (res?.cart) {
                        data = res.cart;
                    } else {
                        // Cart ID is invalid or expired
                        cartId = null;
                        localStorage.removeItem(getCartIdKey(user));
                    }
                } catch (e) {
                    console.warn("Cart fetch failed, will re-create:", e);
                    cartId = null;
                    localStorage.removeItem(getCartIdKey(user));
                }
            }

            if (!cartId) {
                const input = {};
                // Only add buyer identity if we have a valid access token
                if (accessToken) {
                    input.buyerIdentity = { customerAccessToken: accessToken };
                }
                const res = await shopifyFetch({ query: cartCreateMutation, variables: { input } });
                
                if (res?.cartCreate?.userErrors?.length > 0) {
                    console.error("Cart creation errors:", res.cartCreate.userErrors);
                    // Special case: if buyerIdentity failed (e.g. expired token), try without it
                    const fallbackRes = await shopifyFetch({ query: cartCreateMutation, variables: { input: {} } });
                    data = fallbackRes.cartCreate.cart;
                } else {
                    data = res?.cartCreate?.cart;
                }

                if (data?.id) {
                    localStorage.setItem(getCartIdKey(user), data.id);
                }
            }

            if (data) {
                setCartItems(formatCartLines(data.lines));
                setCartCost(data.cost);
                setCheckoutUrl(data.checkoutUrl);
            }
        } catch (error) {
            console.error("Critical error syncing cart with Shopify:", error);
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



    const addToCart = async (product, attributes = []) => {
        if (!product.variantId) return;
        setIsSynchronizing(true);
        try {
            let cartId = localStorage.getItem(getCartIdKey(user));
            
            // Safety: if cartId is missing, try to create it first
            if (!cartId) {
                await fetchOrCreateCart();
                cartId = localStorage.getItem(getCartIdKey(user));
            }

            const res = await shopifyFetch({ 
                query: cartLinesAddMutation, 
                variables: { 
                    cartId, 
                    lines: [{ 
                        merchandiseId: product.variantId, 
                        quantity: 1,
                        attributes: attributes // Attach personalization!
                    }] 
                } 
            });
            
            if (res?.cartLinesAdd?.userErrors?.length > 0) {
                const error = res.cartLinesAdd.userErrors[0];
                console.error("Add to cart user error:", error);
                
                // If it's a 'not found' error, clear cartId and retry once
                if (error.message.toLowerCase().includes("not found") || error.field?.includes("cartId")) {
                    localStorage.removeItem(getCartIdKey(user));
                    await fetchOrCreateCart();
                    return addToCart(product, attributes); // Recursive retry
                }
                throw new Error(error.message);
            }
            
            await fetchOrCreateCart();
            setIsCartOpen(true);
        } catch (error) {
            console.error("Add to cart failed:", error);
            alert(`Could not add item: ${error.message || "Please refresh and try again."}`);
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
