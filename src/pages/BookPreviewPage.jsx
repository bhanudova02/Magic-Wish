import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2, User, Calendar, Globe, Terminal, X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BookPreviewPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [personalization, setPersonalization] = useState(null);
    const [isGenerating, setIsGenerating] = useState(true);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        let interval;
        if (isGenerating) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 98) {
                        clearInterval(interval);
                        return 98;
                    }
                    // Fast at start, slow at end
                    const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.5;
                    return Math.min(prev + increment, 98);
                });
            }, 500);
        } else {
            setProgress(100);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    useEffect(() => {
        const data = localStorage.getItem('last_personalization');
        if (data) {
            const parsedData = JSON.parse(data);
            setPersonalization(parsedData);
            
            const generateImage = async () => {
                setIsGenerating(true);
                setError(null);
                
                const title = parsedData.title || "Magic Story";
                const desc = (parsedData.description || "").substring(0, 150); // Truncate to keep URL safe
                const finalPrompt = `Professional storybook cover titled "${title}". ${desc}. The hero is a ${parsedData.age} year old child named ${parsedData.name}. Scene: ${parsedData.coverpagePrompt}. Magical fantasy, vibrant 8k`;
                
                const seed = Math.floor(Math.random() * 999999);
                const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
                
                console.log("AI Generation URL (Copy this to browser to test):", apiUrl);
                setGeneratedImage(apiUrl);
            };

            generateImage();
        } else {
            navigate('/books');
        }
        window.scrollTo(0, 0);
    }, [navigate]);

    const handleImageLoad = () => {
        setProgress(100);
        setTimeout(() => setIsGenerating(false), 500); // Small delay to show 100%
    };

    const handleImageError = () => {
        setIsGenerating(false);
        // Best fallback: Use the child's own photo if AI fails
        if (personalization?.photo) {
            setGeneratedImage(personalization.photo);
            setError("AI is taking longer than expected. Previewing with your photo!");
        } else {
            setError("Unable to load preview. Please check your connection.");
        }
    };

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
                        
                        {/* AI Generated Preview Section */}
                        <div className="relative aspect-[4/5] md:aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
                             {/* AI Generating Overlay */}
                             {isGenerating && (
                                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 text-center p-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-black text-purple-600">
                                            {Math.round(progress)}%
                                        </div>
                                    </div>
                                    <div className="space-y-4 w-full max-w-xs">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Generating Magic Artwork...</h3>
                                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{progress < 90 ? `Painting for ${personalization?.name || 'your hero'}` : 'Adding final touches...'}</p>
                                        </div>
                                        {/* Progress Bar Container */}
                                        <div className="w-full h-3 bg-purple-50 rounded-full overflow-hidden border border-purple-100 p-0.5">
                                            <div 
                                                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Generated Artwork */}
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                {generatedImage && (
                                    <img 
                                        src={generatedImage} 
                                        alt="Book Preview" 
                                        onLoad={handleImageLoad}
                                        onError={handleImageError}
                                        className="w-full h-full object-cover object-center"
                                    />
                                )}
                                {error && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-yellow-50/90 backdrop-blur-sm border border-yellow-200 px-6 py-2 rounded-full shadow-lg">
                                        <p className="text-yellow-700 font-bold text-xs flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" /> {error}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Overlay Branding */}
                            <div className="absolute top-6 left-6 z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white font-black text-[10px] uppercase tracking-widest">
                                Front Cover Design
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                            <div className="bg-gray-50 p-6 rounded-3xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600 relative overflow-hidden">
                                    {personalization?.photo && <img src={personalization.photo} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Child's Name</p>
                                    <p className="text-xl font-black text-gray-900">{personalization?.name || '...'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Child's Age</p>
                                    <p className="text-xl font-black text-gray-900">{personalization?.age || '...'} Years old</p>
                                </div>
                            </div>
                        </div>

                        {/* Final Combined Prompt Box */}
                        <div className="bg-purple-50 rounded-[2rem] p-8 border-2 border-dashed border-purple-200 space-y-4">
                            <div className="flex items-center gap-2 text-purple-600 font-extrabold text-sm uppercase tracking-[0.15em]">
                                <Sparkles className="w-5 h-5" /> Final AI Manufacturing Instruction
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
                                <p className="text-gray-700 font-bold text-lg leading-relaxed">
                                    "Professional storybook cover titled <span className="text-purple-600">"{personalization?.title}"</span>. 
                                    <span className="text-gray-500 font-medium"> {(personalization?.description || "").substring(0, 100)}...</span>
                                    The hero is a <span className="text-purple-600 underline">{personalization?.age || '...'} year old</span> child named <span className="text-purple-600 underline font-black">{personalization?.name || '...'}</span>. 
                                    Scene: <span className="text-gray-900 italic">"{personalization?.coverpagePrompt}"</span>. 
                                    Maintain a magical fantasy and vibrant 8k style."
                                </p>
                            </div>
                            <p className="text-[10px] text-purple-400 font-medium text-center italic mt-2 italic">* This instruction is sent to our AI production engine to craft your unique book cover.</p>
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
