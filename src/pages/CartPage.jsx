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
                    <div className="flex-1 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 lg:gap-8 items-center lg:items-start group transition hover:border-gray-200">
                                
                                <div className="w-32 h-44 bg-gray-50 rounded-2xl flex-shrink-0 origin-center transition transform group-hover:scale-105 overflow-hidden shadow-sm">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 flex flex-col w-full text-center sm:text-left pt-2">
                                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-2 gap-4">
                                        <h3 className="text-2xl font-black text-[#2b124c] tracking-tight">{item.title}</h3>
                                        <div className="text-xl font-black text-blue-600">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</div>
                                    </div>
                                    
                                    <div className="text-gray-500 capitalize font-medium mb-6">{item.gender} • {item.age}</div>

                                    <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-50">
                                        
                                        <div className="flex items-center gap-4 bg-gray-50 rounded-full px-2 py-1.5 border border-gray-200">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm hover:text-[#2b124c] transition cursor-pointer"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-base font-black text-gray-800 w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm hover:text-[#2b124c] transition cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-[400px]">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 lg:sticky lg:top-[100px]">
                            <h3 className="text-xl font-black text-[#2b124c] mb-6 tracking-tight">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="flex justify-between text-gray-500 font-medium tracking-wide">
                                    <span>Subtotal ({getCartCount()} items)</span>
                                    <span className="text-gray-900">${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium tracking-wide">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-bold uppercase text-xs tracking-widest bg-green-50 px-2 py-1 rounded">Calculated at next step</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Total</span>
                                <span className="text-4xl font-black text-[#2b124c]">${getCartTotal().toFixed(2)}</span>
                            </div>

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
                            
                            <Link to="/books" className="block text-center mt-6 text-sm font-bold text-gray-400 hover:text-blue-600 transition uppercase tracking-widest cursor-pointer">
                                Continue Shopping
                            </Link>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
