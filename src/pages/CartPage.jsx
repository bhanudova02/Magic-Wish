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
        <div className="min-h-screen bg-white pt-16">
            <div className="max-w-4xl mx-auto px-4 py-8 lg:py-16">
                
                <div className="border-b border-gray-100 pb-4 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-black text-[#2b124c] tracking-tight uppercase">Your Bag</h1>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none bg-purple-50 inline-block px-2 py-1 rounded-sm">{getCartCount()} Items</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Items List */}
                    <div className="lg:col-span-12 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-3 border-b border-gray-50 flex gap-4 transition hover:bg-gray-50/50">
                                
                                <div className="w-20 h-28 bg-gray-50 rounded-sm flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="w-6 h-6 text-gray-200" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-sm font-black text-[#2b124c] tracking-tight uppercase truncate">{item.title}</h3>
                                        <div className="text-sm font-black text-blue-600">${((item.priceAmount ?? parseFloat(item.price?.replace('$', '') || '0')) * item.quantity).toFixed(2)}</div>
                                    </div>
                                    
                                    <div className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest italic">{item.gender} • {item.age}</div>

                                    <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                                        
                                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-sm p-0.5 border border-gray-100">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-sm bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 hover:text-purple-600 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="text-xs font-black text-[#2b124c] w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-sm bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 hover:text-purple-600 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simple Order Footer (Inspired by drawer) */}
                    <div className="lg:col-span-12 mt-4">
                        <div className="bg-[#fbfcff] p-6 border border-gray-100 rounded-sm shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 italic">Total Payable</span>
                                    <span className="text-3xl font-black text-[#2b124c] leading-none">${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic leading-none mb-1">Items: {getCartCount()}</p>
                                    <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest leading-none">Shipping: FREE</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={checkout}
                                    disabled={isCheckingOut}
                                    className="w-full py-5 flex items-center justify-center gap-3 text-white font-black bg-[#2b124c] rounded-sm hover:bg-black transition-all uppercase tracking-[0.15em] shadow-xl shadow-purple-50 transform active:scale-[0.98] text-xs cursor-pointer disabled:opacity-70"
                                >
                                    {isCheckingOut ? (
                                        <>Processing Order... <Loader2 className="w-4 h-4 animate-spin" /></>
                                    ) : (
                                        <>Finalize & Pay <ArrowRight className="w-5 h-5" /></>
                                    )}
                                </button>
                                
                                <Link to="/books" className="flex items-center justify-center gap-2 py-3 text-[10px] font-black text-gray-300 hover:text-purple-600 transition-all uppercase tracking-widest cursor-pointer">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
