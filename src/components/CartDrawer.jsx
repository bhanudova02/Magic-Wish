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
            <div className={`fixed inset-y-0 right-0 w-[85%] md:w-full max-w-md bg-white shadow-2xl z-[160] flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="bg-[#fbfcff] px-6 pt-8 pb-6 border-b border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-16 -mt-16 opacity-50"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#2b124c] rounded-sm flex items-center justify-center text-white shadow-lg">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#2b124c] leading-none mb-1">Your Bag</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{getCartCount()} Items Selected</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 text-gray-400 hover:text-purple-600 bg-white rounded-sm shadow-sm border border-gray-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content Areas */}
                <div className="flex-1 overflow-y-auto p-4 bg-[#fafbfc] flex flex-col">
                    {cartItems.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 bg-white rounded-sm shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                                <ShoppingBag className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-[#2b124c] mb-2 uppercase tracking-tight">Empty Bag</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">It seems you haven't added any magic to your bag yet.</p>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="w-full py-4 bg-[#2b124c] text-white rounded-sm font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-purple-100 transition-all hover:-translate-y-0.5"
                            >
                                Discover Books
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-3 rounded-sm border border-gray-100 shadow-sm flex gap-4 group transition-all hover:border-purple-100">
                                    <div className="w-20 h-24 bg-gray-50 rounded-sm flex-shrink-0 overflow-hidden border border-gray-100">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-6 h-6 text-gray-200" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col min-w-0 py-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-[#2b124c] text-sm leading-tight truncate uppercase tracking-tight">{item.title}</h4>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{item.gender} • {item.age}</div>
                                        
                                        <div className="mt-auto flex items-center justify-between pt-2">
                                            {/* Quantity Controller */}
                                            <div className="flex items-center gap-1.5 bg-gray-50 rounded-sm p-1 border border-gray-100">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 rounded-sm bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 hover:text-purple-600 active:scale-95 transition-all"
                                                >
                                                    <Minus className="w-2.5 h-2.5" />
                                                </button>
                                                <span className="text-xs font-black text-[#2b124c] w-8 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-sm bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 hover:text-purple-600 active:scale-95 transition-all"
                                                >
                                                    <Plus className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                            
                                            <div className="font-black text-blue-600 text-sm">
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
                    <div className="border-t border-gray-100 bg-white p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] pb-10">
                        <div className="flex justify-between items-baseline mb-6">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Subtotal</span>
                            <span className="text-2xl font-black text-[#2b124c]">${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="space-y-3">
                            <button 
                                onClick={checkout}
                                disabled={isCheckingOut}
                                className="w-full py-4.5 flex items-center justify-center gap-3 text-white font-black bg-[#2b124c] rounded-sm hover:bg-black transition-all uppercase tracking-[0.15em] shadow-xl shadow-purple-100 transform active:scale-[0.98] text-[11px]"
                            >
                                {isCheckingOut ? (
                                    <>Processing... <Loader2 className="w-4 h-4 animate-spin" /></>
                                ) : (
                                    <>Verify & Checkout <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                            <Link 
                                to="/cart" 
                                onClick={() => setIsCartOpen(false)}
                                className="w-full py-3.5 text-[#2b124c] font-black bg-white border border-gray-200 rounded-sm hover:border-[#2b124c] transition-all uppercase tracking-[0.15em] flex items-center justify-center text-[10px] hover:bg-gray-50"
                            >
                                Cart Details
                            </Link>
                        </div>
                        <p className="mt-4 text-[9px] text-gray-300 text-center font-bold tracking-widest uppercase italic">* Shipping calculated at checkout</p>
                    </div>
                )}
            </div>
        </>
    );
}
