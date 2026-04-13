import React, { useEffect } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const { 
        cartItems, 
        updateQuantity, 
        removeFromCart, 
        getCartTotal, 
        getCartCount, 
        setIsCartOpen,
        checkout,
        isCheckingOut
    } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
        setIsCartOpen(false); // Close drawer if open when visiting page
    }, []);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fbfbff] pt-20 px-6">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-[#2b124c] mb-4 text-center tracking-tight">Your Magic Bag is Empty</h1>
                <p className="text-gray-500 mb-10 max-w-md text-center text-lg">
                    Looks like you haven't added any personalized adventures yet. Let's find a story that will make them smile.
                </p>
                <Link 
                    to="/books" 
                    className="flex text-lg items-center gap-3 px-10 py-5 bg-purple-600 text-white rounded-sm font-bold hover:bg-purple-700 transition transform hover:-translate-y-1 cursor-pointer"
                >
                    Start Browsing <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbfbff] pt-[64px]">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 lg:px-8">
                
                <div className="flex items-end justify-between border-b-2 border-gray-100 pb-6 mb-10">
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-black text-[#2b124c] tracking-tight">Your Bag</h1>
                        <p className="text-gray-500 mt-2 font-medium">{getCartCount()} items ready for checkout</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Items List */}
                    <div className="flex-1 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start group transition hover:border-purple-100 shadow-sm">
                                
                                <div className="w-24 h-32 bg-gray-50 rounded-sm flex-shrink-0 overflow-hidden border border-gray-100">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="w-8 h-8 text-gray-200" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 flex flex-col min-w-0 py-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-xl font-black text-[#2b124c] tracking-tight uppercase truncate">{item.title}</h3>
                                        <div className="text-lg font-black text-blue-600">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</div>
                                    </div>
                                    
                                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{item.gender} • {item.age}</div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                        
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-sm p-1 border border-gray-100">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-10 rounded-sm bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 hover:text-purple-600 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-black text-[#2b124c] w-10 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 rounded-sm bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 hover:text-purple-600 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex items-center gap-2 text-[10px] font-black text-gray-300 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer group/remove"
                                        >
                                            <Trash2 className="w-4 h-4 group-hover/remove:translate-y-[-1px] transition-transform" />
                                            Remove Item
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-[400px]">
                        <div className="bg-white rounded-sm p-8 shadow-sm border border-gray-100 lg:sticky lg:top-[120px]">
                            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-6 italic">Order Summary</h3>
                            
                            <div className="space-y-4 mb-8 pb-6 border-b border-gray-50">
                                <div className="flex justify-between text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-black text-base">${getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline mb-10">
                                <span className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] italic">Total Amount</span>
                                <span className="text-4xl font-black text-[#2b124c]">${getCartTotal().toFixed(2)}</span>
                            </div>

                            <button 
                                onClick={checkout}
                                disabled={isCheckingOut}
                                className="w-full py-5 flex items-center justify-center gap-3 text-white font-black bg-[#2b124c] rounded-sm hover:bg-black transition-all uppercase tracking-[0.2em] shadow-xl shadow-purple-100 transform active:scale-[0.98] text-[11px] cursor-pointer disabled:opacity-70"
                            >
                                {isCheckingOut ? (
                                    <>Processing Order... <Loader2 className="w-4 h-4 animate-spin" /></>
                                ) : (
                                    <>Complete Payment <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                            
                            <Link to="/books" className="block text-center mt-6 text-[10px] font-black text-gray-300 hover:text-purple-600 transition-all uppercase tracking-[0.2em] cursor-pointer group">
                                <span className="group-hover:mr-2 transition-all">←</span> Back to Books
                            </Link>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
