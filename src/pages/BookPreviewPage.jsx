import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2, User, Calendar, Globe, Terminal, X, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BookPreviewPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [personalization, setPersonalization] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    // Helper for prompt
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
            
            // Check if we already have a generated image from a previous load
            if (parsedData.generatedImage) {
                setGeneratedImage(parsedData.generatedImage);
                setIsGenerating(false);
                setProgress(100);
            } else {
                startGeneration(parsedData);
            }
        } catch (e) {
            console.error("Failed to parse personalization data:", e);
            navigate('/books');
        }
        window.scrollTo(0, 0);
    }, [navigate]);

    const startGeneration = async (parsedData) => {
        setIsGenerating(true);
        setError(null);
        
        const title = parsedData.title || "Magic Story";
        const desc = (parsedData.description || "").substring(0, 150);
        const activePrompt = `Professional storybook cover titled "${title}". ${desc}. The hero is a ${parsedData.age} year old child named ${parsedData.name}. Scene: ${parsedData.coverpagePrompt}. Magical fantasy, vibrant 8k`;
        
        const seed = Math.floor(Math.random() * 999999);
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(activePrompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
        
        // Initial fast show
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
                    const finalUrl = cloudResult.secure_url;
                    setGeneratedImage(finalUrl);
                    
                    // SAVE TO LOCAL STORAGE to prevent re-generation on refresh
                    const currentData = JSON.parse(localStorage.getItem('last_personalization'));
                    localStorage.setItem('last_personalization', JSON.stringify({
                        ...currentData,
                        generatedImage: finalUrl
                    }));
                }
            }
        } catch (err) {
            console.warn("Background persistence failed:", err);
        }
    };

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
            setError("Unable to generate preview.");
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
        if (personalization && !isGenerating && generatedImage) {
            console.log("%cFinal AI Manufacturing Instruction:", "color: #a21caf; font-weight: bold; font-size: 14px;");
            console.log(finalAIInstruction);
        }
    }, [isGenerating, finalAIInstruction, personalization, generatedImage]);

    if (!personalization) return null;

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            {/* Minimal Header (No nav links to keep it focused) */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="font-black text-xl tracking-tighter text-gray-900">Magic<span className="text-purple-600">Wish</span></span>
                </div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest hidden sm:block">
                    Preview Mode
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 pt-28 pb-32">
                <div className="w-full max-w-[420px] mx-auto space-y-8">
                    
                    {/* Centered Large Book Preview */}
                    <div className="relative group">
                        {/* Shadow Decor */}
                        <div className="absolute -inset-10 bg-purple-500/5 blur-[100px] rounded-full -z-10"></div>
                        
                        <div className="relative aspect-[4/5] bg-white rounded-[1.5rem] shadow-2xl border-x-[8px] border-white overflow-hidden ring-1 ring-black/5 flex items-center justify-center">
                            {isGenerating && (
                                <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-8 space-y-10">
                                    <h2 className="text-xl font-black text-gray-900">Crafting your story...</h2>
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden relative border-2 border-white shadow-lg">
                                            {personalization?.photo ? (
                                                <img src={personalization.photo} className="w-full h-full object-cover" alt="Hero" />
                                            ) : (
                                                <User className="w-8 h-8 text-purple-200" />
                                            )}
                                        </div>
                                        <div className="absolute -inset-3 border-[3px] border-purple-50 border-t-purple-600 rounded-full animate-spin"></div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        Wait {Math.max(0, 30 - Math.floor((progress / 100) * 30))}s
                                    </div>
                                </div>
                            )}
                            
                            <img 
                                src={generatedImage} 
                                alt="Book Cover" 
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating ? 'blur-2xl opacity-0' : 'blur-0 opacity-100'}`}
                            />
                        </div>
                    </div>

                    {!isGenerating && !error && (
                         <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <h3 className="text-lg font-black text-gray-900">{personalization.name}'s Adventure</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Final cover design ready</p>
                         </div>
                    )}
                </div>
            </div>

            {/* Fixed Bottom Bar - User Friendly */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-100 p-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                
                {/* Step Indicator */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Personalize</span>
                    </div>
                    <div className="w-8 h-px bg-gray-100"></div>
                    <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${isGenerating ? 'bg-gray-200' : 'bg-purple-600'}`}>
                            {isGenerating ? <span className="text-[9px] font-black">2</span> : <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isGenerating ? 'text-gray-400' : 'text-gray-900'}`}>Preview</span>
                    </div>
                </div>

                {/* Primary Action */}
                <button 
                    onClick={handleAddToCart}
                    disabled={isGenerating}
                    className={`w-full sm:w-auto min-w-[240px] py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isGenerating ? 'bg-gray-100 text-gray-400 opacity-50' : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xl shadow-indigo-100'}`}
                >
                    {isGenerating ? 'Wait for Preview...' : 'Continue to Checkout'}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
