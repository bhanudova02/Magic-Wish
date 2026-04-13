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
            
            if (parsedData.generatedImage) {
                setGeneratedImage(parsedData.generatedImage);
                setIsGenerating(false);
                setProgress(100);
            } else {
                startGeneration(parsedData);
            }
        } catch (e) {
            console.error("Failed to parse personalization:", e);
            navigate('/books');
        }
    }, [navigate]);

    const startGeneration = async (parsedData) => {
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
                    const finalUrl = cloudResult.secure_url;
                    setGeneratedImage(finalUrl);
                    
                    const currentData = JSON.parse(localStorage.getItem('last_personalization'));
                    localStorage.setItem('last_personalization', JSON.stringify({
                        ...currentData,
                        generatedImage: finalUrl
                    }));
                }
            }
        } catch (err) {
            console.warn("Background upload failed:", err);
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
            setError("AI is busy. Showing your photo!");
        } else {
            setError("Preview unavailable.");
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
        <div className="bg-[#fcfaff] min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Simplified Content Layout */}
                <div className="flex flex-col items-center gap-12">
                    
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Preview Your Adventure</h1>
                        <p className="text-gray-500 font-medium">Your personalized cover is ready to view</p>
                    </div>

                    <div className="relative w-full max-w-[440px]">
                        {/* 3D Book Shadow Effect */}
                        <div className="absolute -inset-10 bg-purple-500/5 blur-[80px] rounded-full -z-10"></div>
                        
                        <div className="relative aspect-[4/5] bg-white rounded-3xl shadow-2xl border-x-[10px] border-white overflow-hidden flex items-center justify-center">
                            {isGenerating && (
                                <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-8">
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden relative border-2 border-white shadow-md">
                                            {personalization?.photo && <img src={personalization.photo} className="w-full h-full object-cover opacity-50" />}
                                        </div>
                                        <div className="absolute -inset-4 border-2 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Generating {Math.round(progress)}%</p>
                                </div>
                            )}
                            
                            <img 
                                src={generatedImage} 
                                alt="Book Preview" 
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                className={`w-full h-full object-cover transition-opacity duration-1000 ${isGenerating ? 'opacity-0' : 'opacity-100'}`}
                            />
                        </div>
                    </div>

                    <div className="w-full max-w-[440px] flex flex-col gap-4">
                        <button 
                            onClick={handleAddToCart}
                            disabled={isGenerating}
                            className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isGenerating ? 'bg-gray-100 text-gray-400' : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xl shadow-indigo-100 hover:-translate-y-1'}`}
                        >
                            {isGenerating ? 'Generating...' : 'Continue to Cart'}
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-full py-4 text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-gray-600 transition"
                        >
                            Back to Customise
                        </button>
                    </div>

                    {error && (
                        <div className="bg-yellow-50 text-yellow-700 px-6 py-3 rounded-2xl text-xs font-bold border border-yellow-100 text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
