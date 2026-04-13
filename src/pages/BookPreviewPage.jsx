import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2, User, Calendar, Globe, Terminal } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BookPreviewPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [personalization, setPersonalization] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('last_personalization');
        if (data) {
            setPersonalization(JSON.parse(data));
        } else {
            navigate('/books');
        }
        window.scrollTo(0, 0);
    }, [navigate]);

    if (!personalization) return null;

    const handleAddToCart = () => {
        addToCart({ 
            id: personalization.productId, 
            variantId: personalization.variantId, 
            title: personalization.title
        });
    };

    return (
        <div className="bg-[#fdf2f8] min-h-screen pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 font-bold hover:text-purple-600 transition group w-fit"
                >
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-purple-50 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    Back to Edit
                </button>

                {/* Info Card */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-200/50 border border-purple-50">
                    
                    {/* Header Banner */}
                    <div className="bg-purple-600 p-8 text-center space-y-2">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> Preview Confirmation
                        </div>
                        <h1 className="text-3xl font-black text-white leading-tight">Child's Personalisation</h1>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        
                        {/* Photo Box */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[2rem] border-8 border-purple-50 shadow-xl overflow-hidden transform rotate-2">
                                <img 
                                    src={personalization.photo} 
                                    alt="Child" 
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <span className="text-[10px] bg-green-100 text-green-700 font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Uploaded Successfully
                            </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-3xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Child's Name</p>
                                    <p className="text-xl font-black text-gray-900">{personalization.name}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Child's Age</p>
                                    <p className="text-xl font-black text-gray-900">{personalization.age} Years old</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Language</p>
                                    <p className="text-xl font-black text-gray-900">{personalization.language}</p>
                                </div>
                            </div>
                            <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100 flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600 group-hover:scale-110 transition">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Selected Book</p>
                                    <p className="text-xl font-black text-gray-900 truncate max-w-[180px]">{personalization.title}</p>
                                </div>
                            </div>
                        </div>

                        {/* Prompt Text Box */}
                        <div className="bg-gray-900 rounded-3xl p-8 space-y-4 shadow-xl">
                            <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest">
                                <Terminal className="w-4 h-4" /> AI Generation Prompt
                            </div>
                            <p className="text-gray-300 font-mono text-sm leading-relaxed italic">
                                "{personalization.coverpagePrompt || 'No specific prompt added for this book yet.'}"
                            </p>
                        </div>

                        {/* Final Combined Prompt Box */}
                        <div className="bg-purple-50 rounded-[2rem] p-8 border-2 border-dashed border-purple-200 space-y-4">
                            <div className="flex items-center gap-2 text-purple-600 font-extrabold text-sm uppercase tracking-[0.15em]">
                                <Sparkles className="w-5 h-5" /> Final AI Manufacturing Instruction
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
                                <p className="text-gray-700 font-bold text-lg leading-relaxed">
                                    "Generate a premium book cover artwork featuring <span className="text-purple-600 underline">a {personalization.age} year old child named {personalization.name}</span> in a scene described as: <span className="text-gray-900 italic">{personalization.coverpagePrompt}</span>. Maintain a magical, cinematic, and vibrant fantasy style."
                                </p>
                            </div>
                            <p className="text-[10px] text-purple-400 font-medium text-center italic mt-2 italic">* This instruction will be sent to our AI artist to craft your unique book cover.</p>
                        </div>

                        {/* Checkout Section */}
                        <div className="pt-8 border-t border-gray-100 flex flex-col items-center space-y-4">
                            <button 
                                onClick={handleAddToCart}
                                className="w-full max-w-sm bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 transition-all transform hover:scale-[1.05] active:scale-95 shadow-xl shadow-purple-100"
                            >
                                <ShoppingCart className="w-7 h-7" /> Add to Cart
                            </button>
                            <div className="flex items-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span>Verified Order</span>
                                <span>•</span>
                                <span>Fast Delivery</span>
                                <span>•</span>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
