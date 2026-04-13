import React, { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
    const { 
        isCartOpen, 
        setIsCartOpen, 
        cartItems, 
        updateQuantity, 
        removeFromCart, 
        getCartTotal, 
        getCartCount,
        checkout,
        isCheckingOut
    } = useCart();

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-[85%] md:w-full max-w-md bg-white shadow-2xl z-[160] flex flex-col transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-gray-800" />
                        <h2 className="text-xl font-black text-[#2b124c]">Your Bag ({getCartCount()})</h2>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Main Content Areas */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col">
                    {cartItems.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                            <h3 className="text-xl font-black text-[#2b124c] mb-2">Your magic bag is empty</h3>
                            <p className="text-gray-500 mb-8">Ready to add your first story?</p>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="px-8 py-3 bg-purple-600 text-white rounded-sm font-bold hover:bg-purple-700 transition-colors cursor-pointer"
                            >
                                Start Browsing
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm flex gap-4">
                                    <div className="w-24 h-32 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col pt-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-[#2b124c] text-sm leading-tight pr-4">{item.title}</h4>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-gray-500 text-xs mt-1 capitalize">{item.gender} • {item.age}</div>
                                        
                                        <div className="mt-auto flex items-center justify-between">
                                            {/* Quantity Controller */}
                                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1 border border-gray-200">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm hover:text-[#2b124c] cursor-pointer"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm hover:text-[#2b124c] cursor-pointer"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            
                                            <div className="font-black text-blue-600">
                                                ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 bg-white p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Subtotal</span>
                            <span className="text-2xl font-black text-[#2b124c]">${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="space-y-2">
                            <button 
                                onClick={checkout}
                                disabled={isCheckingOut}
                                className="w-full py-4 flex items-center justify-center gap-2 text-white font-bold bg-green-500 rounded-sm hover:bg-green-600 transition-all uppercase tracking-widest transform hover:-translate-y-1 text-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isCheckingOut ? (
                                    <>Processing... <Loader2 className="w-4 h-4 animate-spin" /></>
                                ) : (
                                    <>Continue to Checkout <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                            <Link 
                                to="/cart" 
                                onClick={() => setIsCartOpen(false)}
                                className="w-full py-3 text-[#2b124c] font-bold bg-white border border-gray-200 rounded-sm hover:border-[#2b124c] transition-colors uppercase tracking-widest flex items-center justify-center text-[11px] cursor-pointer"
                            >
                                View Cart Page
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
