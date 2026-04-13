import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2, User, Calendar, Globe, Terminal, X, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BookPreviewPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [personalization, setPersonalization] = useState(null);
    const [isGenerating, setIsGenerating] = useState(true);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    // Prompt generator helper
    const getFinalAIInstruction = (data) => {
        if (!data) return "";
        return `Professional storybook cover titled "${data.title}". ${data.description}. The hero is a ${data.age} year old child named ${data.name}. Scene: ${data.coverpagePrompt}. Maintain a magical fantasy and vibrant 8k style.`;
    };

    const finalAIInstruction = personalization ? getFinalAIInstruction(personalization) : "";

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
                    const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.4;
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
        const stored = localStorage.getItem('last_personalization');
        if (!stored) {
            navigate('/books');
            return;
        }

        try {
            const parsedData = JSON.parse(stored);
            setPersonalization(parsedData);
            
            const generateImage = async () => {
                setIsGenerating(true);
                setError(null);
                
                const title = parsedData.title || "Magic Story";
                const desc = (parsedData.description || "").substring(0, 150);
                const activePrompt = `Professional storybook cover titled "${title}". ${desc}. The hero is a ${parsedData.age} year old child named ${parsedData.name}. Scene: ${parsedData.coverpagePrompt}. Magical fantasy, vibrant 8k`;
                
                const seed = Math.floor(Math.random() * 999999);
                const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(activePrompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
                
                setGeneratedImage(pollUrl);

                try {
                    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
                    
                    if (cloudName && preset) {
                        const response = await fetch(pollUrl);
                        const blob = await response.blob();
                        const uploadData = new FormData();
                        uploadData.append('file', blob);
                        uploadData.append('upload_preset', preset);
                        
                        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                            method: 'POST',
                            body: uploadData
                        });
                        
                        const cloudResult = await cloudRes.json();
                        if (cloudResult.secure_url) {
                            setGeneratedImage(cloudResult.secure_url);
                        }
                    }
                } catch (err) {
                    console.warn("Cloudinary background upload failed:", err);
                }
            };

            generateImage();
        } catch (e) {
            console.error("Failed to parse personalization data:", e);
            navigate('/books');
        }
        window.scrollTo(0, 0);
    }, [navigate]);

    const handleImageLoad = () => {
        setProgress(100);
        setTimeout(() => setIsGenerating(false), 800);
    };

    const handleImageError = () => {
        setIsGenerating(false);
        if (personalization?.photo) {
            setGeneratedImage(personalization.photo);
            setError("AI preview is taking longer. Using your photo!");
        } else {
            setError("Unable to generate preview. Please try again.");
        }
    };

    const handleAddToCart = () => {
        if (!personalization) return;

        const attributes = [
            { key: "Child Name", value: personalization.name || "" },
            { key: "Child Age", value: String(personalization.age || "") },
            { key: "Language", value: personalization.language || "English" },
            { key: "Child Photo", value: personalization.photo || "" },
            { key: "AI Cover URL", value: generatedImage || "" },
            { key: "Manufacturing Instruction", value: finalAIInstruction }
        ];

        addToCart({ 
            id: personalization.productId, 
            variantId: personalization.variantId, 
            title: personalization.title
        }, attributes);
    };

    useEffect(() => {
        if (personalization && !isGenerating) {
            console.log("%cFinal AI Manufacturing Instruction:", "color: #a21caf; font-weight: bold; font-size: 14px;");
            console.log(finalAIInstruction);
        }
    }, [isGenerating, finalAIInstruction, personalization]);

    if (!personalization && isGenerating) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Blur Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div 
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-[120px] opacity-10 transition-all duration-1000"
                    style={{ backgroundImage: `url(${generatedImage || (personalization ? personalization.photo : '')})` }}
                ></div>
                <div className="absolute inset-0 bg-white/60"></div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10 pt-20 pb-36">
                <div className="relative w-full max-w-[480px]">
                    {/* Shadow Decor */}
                    <div className="absolute -inset-10 bg-purple-500/5 blur-3xl rounded-full -z-10"></div>
                    
                    {/* Book Frame Container */}
                    <div className="relative aspect-[4/5] bg-white rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border-x-[12px] border-white overflow-hidden flex flex-col items-center justify-center">
                        
                        {/* Generation Overlay */}
                        {isGenerating && (
                            <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-10">
                                <h2 className="text-2xl font-black text-gray-900 mb-12 tracking-tight">Your story is coming together...</h2>
                                
                                <div className="relative mb-12">
                                    <div className="w-32 h-32 rounded-3xl bg-gray-50 overflow-hidden relative border-4 border-white shadow-xl">
                                        {personalization?.photo ? (
                                            <img src={personalization.photo} className="w-full h-full object-cover" alt="Hero" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-purple-50">
                                                <User className="w-12 h-12 text-purple-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                                            <Sparkles className="w-16 h-16 text-white opacity-60 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="absolute -inset-4 border-2 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase">
                                    <span>Please wait.</span>
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[10px]">
                                        {Math.max(0, 30 - Math.floor((progress / 100) * 30))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Image Layer */}
                        <div className="w-full h-full bg-gray-50">
                            {generatedImage && (
                                <img 
                                    src={generatedImage} 
                                    alt="Personalized Book Cover" 
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating ? 'scale-110 blur-2xl' : 'scale-100 blur-0'}`}
                                />
                            )}
                        </div>
                    </div>
                    {error && !isGenerating && (
                        <div className="mt-4 text-center">
                            <p className="inline-block bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-xs font-bold border border-yellow-100">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 py-6 px-6 md:px-16 flex items-center justify-between">
                {/* Desktop Step Indicator */}
                <div className="hidden md:flex items-center gap-12 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black text-purple-600 uppercase tracking-widest border-b-2 border-purple-600 pb-1">Book</span>
                    </div>
                    <div className="w-16 h-px bg-gray-100"></div>
                    <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${isGenerating ? 'bg-gray-200' : 'bg-purple-600'}`}>
                            {isGenerating ? <span className="text-[10px] font-black">2</span> : <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest border-b-2 pb-1 ${isGenerating ? 'text-gray-400 border-transparent' : 'text-purple-600 border-purple-600'}`}>Preview</span>
                    </div>
                </div>

                {/* Main Action Call */}
                <div className="flex-1 md:flex-none">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isGenerating}
                        className={`w-full md:min-w-[220px] py-4 px-10 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isGenerating ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xl shadow-indigo-100 hover:-translate-y-1'}`}
                    >
                        {isGenerating ? 'Processing...' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
