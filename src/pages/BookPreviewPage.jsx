import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2, User, Calendar, Globe, Terminal, X, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BookPreviewPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [personalization, setPersonalization] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const getFinalAIInstruction = (data) => {
        if (!data) return "";
        return `Professional storybook cover titled "${data.title}". ${data.description}. The hero is a ${data.age} year old child named ${data.name}. Scene: ${data.coverpagePrompt}. Maintain a magical fantasy and vibrant 8k style.`;
    };

    const finalAIInstruction = personalization ? getFinalAIInstruction(personalization) : "";

    useEffect(() => {
        let interval;
        if (isGenerating || isUploading) {
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
    }, [isGenerating, isUploading]);

    useEffect(() => {
        const stored = localStorage.getItem('last_personalization');
        if (!stored) {
            navigate('/books');
            return;
        }

        try {
            const parsedData = JSON.parse(stored);
            setPersonalization(parsedData);
            
            // If we already have a Cloudinary URL, use it and don't re-generate
            if (parsedData.generatedImage && parsedData.generatedImage.includes('cloudinary')) {
                setGeneratedImage(parsedData.generatedImage);
                setCloudinaryUrl(parsedData.generatedImage);
                setIsGenerating(false);
                setIsUploading(false);
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
        
        // Show temporary pollinations image to user immediately
        setGeneratedImage(pollUrl);

        try {
            setIsUploading(true);
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            
            if (cloudName && preset) {
                // Fetch the image from pollinations and upload to cloudinary
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
                    setCloudinaryUrl(finalUrl);
                    setGeneratedImage(finalUrl); // Switch user view to permanent URL
                    setIsUploading(false);
                    
                    // SAVE TO LOCAL STORAGE to prevent re-generation
                    const currentData = JSON.parse(localStorage.getItem('last_personalization'));
                    localStorage.setItem('last_personalization', JSON.stringify({
                        ...currentData,
                        generatedImage: finalUrl
                    }));
                }
            }
        } catch (err) {
            console.warn("Cloudinary upload failed:", err);
            setIsUploading(false);
        }
    };

    const handleImageLoad = () => {
        if (!isUploading) {
            setProgress(100);
            setTimeout(() => setIsGenerating(false), 500);
        }
    };

    const handleImageError = () => {
        setIsGenerating(false);
        setIsUploading(false);
        if (personalization?.photo) {
            setGeneratedImage(personalization.photo);
            setCloudinaryUrl(personalization.photo);
            setError("AI preview using fallback photo.");
        } else {
            setError("Preview unavailable.");
        }
    };

    const handleAddToCart = () => {
        if (!personalization || !cloudinaryUrl) return; // FORBID adding without cloudinary URL

        const attributes = [
            { key: "Child Name", value: personalization.name || "" },
            { key: "Child Age", value: String(personalization.age || "") },
            { key: "Language", value: personalization.language || "English" },
            { key: "Child Photo", value: personalization.photo || "" },
            { key: "AI Cover URL", value: cloudinaryUrl }, // ONLY CLOUDINARY URL GOES TO SHOPIFY
            { key: "Manufacturing Instruction", value: finalAIInstruction }
        ];

        addToCart({ 
            id: personalization.productId, 
            variantId: personalization.variantId, 
            title: personalization.title
        }, attributes);
    };

    useEffect(() => {
        if (personalization && !isGenerating && !isUploading && cloudinaryUrl) {
            console.log("%cFinal AI Manufacturing Instruction:", "color: #a21caf; font-weight: bold; font-size: 14px;");
            console.log(finalAIInstruction);
            console.log("Verified Permanent Cloudinary URL:", cloudinaryUrl);
        }
    }, [isGenerating, isUploading, finalAIInstruction, personalization, cloudinaryUrl]);

    if (!personalization) return null;

    const canContinue = !isGenerating && !isUploading && cloudinaryUrl;

    return (
        <div className="bg-[#fcfaff] min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col items-center gap-12">
                    
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Preview Your Adventure</h1>
                        <p className="text-gray-500 font-medium">Your storybook is almost ready</p>
                    </div>

                    <div className="relative w-full max-w-[420px]">
                        <div className="absolute -inset-10 bg-purple-500/5 blur-[80px] rounded-full -z-10"></div>
                        
                        <div className="relative aspect-[4/5] bg-white rounded-3xl shadow-2xl border-x-[10px] border-white overflow-hidden flex items-center justify-center">
                            {(isGenerating || isUploading) && (
                                <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-8">
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden border-2 border-white shadow-md">
                                            {personalization?.photo && <img src={personalization.photo} className="w-full h-full object-cover opacity-50" />}
                                        </div>
                                        <div className="absolute -inset-4 border-2 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        {isUploading ? "Finalizing Security..." : `Painting Cover ${Math.round(progress)}%`}
                                    </p>
                                </div>
                            )}
                            
                            <img 
                                src={generatedImage} 
                                alt="Cover" 
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                className={`w-full h-full object-cover transition-opacity duration-1000 ${(isGenerating || isUploading) ? 'opacity-0' : 'opacity-100'}`}
                            />
                        </div>
                    </div>

                    <div className="w-full max-w-[420px] flex flex-col gap-4">
                        <button 
                            onClick={handleAddToCart}
                            disabled={!canContinue}
                            className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${!canContinue ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95'}`}
                        >
                            {!canContinue ? (isUploading ? 'Securing Image...' : 'Please Wait...') : 'Continue to Cart'}
                            {canContinue && <ArrowRight className="w-6 h-6" />}
                        </button>
                        
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-full py-2 text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-gray-600 transition"
                        >
                            Edit Personalization
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
