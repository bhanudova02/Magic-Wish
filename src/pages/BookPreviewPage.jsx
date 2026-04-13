import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2, User, Calendar, Globe, Terminal, X, Check, ArrowRight, BookOpen, Clock, Loader2 } from 'lucide-react';
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
            
            // Check if we already have a generated image (either Cloudinary or Pollinations)
            if (parsedData.generatedImage) {
                setGeneratedImage(parsedData.generatedImage);
                if (parsedData.generatedImage.includes('cloudinary')) {
                    setCloudinaryUrl(parsedData.generatedImage);
                }
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
        
        setGeneratedImage(pollUrl);
        
        // Instant save to prevent re-generation if user refreshes during generation
        try {
            const currentData = JSON.parse(localStorage.getItem('last_personalization') || '{}');
            localStorage.setItem('last_personalization', JSON.stringify({
                ...currentData,
                generatedImage: pollUrl
            }));
        } catch (e) {
            console.error("Failed to save temporary preview:", e);
        }

        try {
            setIsUploading(true);
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
                    setCloudinaryUrl(finalUrl);
                    setGeneratedImage(finalUrl);
                    setIsUploading(false);
                    
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
            setError(null);
        } else {
            setError("Preview unavailable.");
        }
    };

    const handleAddToCart = () => {
        if (!personalization || !cloudinaryUrl) return;

        const attributes = [
            { key: "Child Name", value: personalization.name || "" },
            { key: "Child Age", value: String(personalization.age || "") },
            { key: "Language", value: personalization.language || "English" },
            { key: "Child Photo", value: personalization.photo || "" },
            { key: "AI Cover URL", value: cloudinaryUrl },
            { key: "Manufacturing Instruction", value: finalAIInstruction }
        ];

        addToCart({ 
            id: personalization.productId, 
            variantId: personalization.variantId, 
            title: personalization.title
        }, attributes);
    };

    const canContinue = !isGenerating && !isUploading && cloudinaryUrl;

    return (
        <div className="bg-[#E0EBFF] min-h-screen pt-24 pb-20 overflow-hidden relative">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDE2FF] rounded-sm mix-blend-multiply filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E2E0FF] rounded-sm mix-blend-multiply filter blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left side: Book Information */}
                    <div className="lg:col-span-5 space-y-10 animate-in slide-in-from-left duration-700">
                        <div className="space-y-6">
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-[#624da0] font-black text-sm uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                            >
                                <ArrowLeft className="w-5 h-5" /> Go Back
                            </button>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                Your Magical <br />
                                <span className="text-[#624da0]">Book Preview</span>
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                                We've customized the cover specifically for <span className="text-[#624da0] font-bold">{personalization?.name}</span>. 
                                Take a look at how the book will appear before finalizing your order.
                            </p>
                        </div>

                        {/* Order Summary Card */}
                        <div className="bg-white rounded-sm p-6 shadow-xl shadow-blue-100/50 border border-blue-50 space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Personalization Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#624da0]/60 uppercase tracking-widest">Child's Name</p>
                                    <p className="text-lg font-black text-gray-900">{personalization?.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#624da0]/60 uppercase tracking-widest">Language</p>
                                    <p className="text-lg font-black text-gray-900">{personalization?.language}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#624da0]/60 uppercase tracking-widest">Book Title</p>
                                    <p className="text-sm font-bold text-gray-700">{personalization?.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#624da0]/60 uppercase tracking-widest">Manufacturing</p>
                                    <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" /> 3-5 Days
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={handleAddToCart}
                                disabled={!canContinue}
                                className={`w-full py-5 rounded-sm font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${!canContinue ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#624da0] hover:bg-[#4d3a82] text-white shadow-xl shadow-purple-200/50 hover:scale-[1.02] active:scale-95'}`}
                            >
                                {!canContinue ? (isUploading ? 'Securing Preview...' : 'Generating...') : 'Add to Cart'}
                                {canContinue && <ArrowRight className="w-6 h-6" />}
                                {!canContinue && <Loader2 className="w-6 h-6 animate-spin" />}
                            </button>
                            <p className="text-center text-xs font-bold text-gray-400 flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Premium Hardcover Print Quality Verified
                            </p>
                        </div>
                    </div>

                    {/* Right side: Interactive Book Mockup */}
                    <div className="lg:col-span-7 relative animate-in zoom-in duration-700 delay-200 max-w-[540px] mx-auto w-full">
                        <div className="absolute -inset-10 bg-[#624da0]/10 blur-[100px] rounded-sm -z-10"></div>
                        
                        <div className="relative aspect-[4/5] bg-white rounded-sm shadow-[0_30px_60px_-12px_rgba(37,99,235,0.25)] border-l-[12px] border-white overflow-hidden group">
                            {(isGenerating || isUploading) && (
                                <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-8">
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 rounded-sm bg-[#E0EBFF] overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                                            {personalization?.photo ? (
                                                <img src={personalization.photo} className="w-full h-full object-cover" alt="Reference" />
                                            ) : (
                                                <User className="w-10 h-10 text-[#624da0]/30" />
                                            )}
                                        </div>
                                        <div className="absolute -inset-4 border-2 border-dashed border-[#624da0]/40 rounded-sm animate-spin-slow"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <p className="text-xs font-black text-[#624da0] uppercase tracking-widest">Creating Magic</p>
                                            <h4 className="text-2xl font-black text-gray-900 leading-none">{Math.round(progress)}%</h4>
                                        </div>
                                        {/* Minimal Progress Bar */}
                                        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#624da0] transition-all duration-500 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 max-w-[200px] mx-auto">
                                            {isUploading ? "Uploading to secure servers..." : "Our AI is illustrating your child into the story..."}
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            <img 
                                src={generatedImage} 
                                alt="Book Cover Preview" 
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${(isGenerating || isUploading) ? 'opacity-0' : 'opacity-100'}`}
                            />
                        </div>

                        {/* Floating elements for depth */}
                        <div className="hidden lg:block absolute -top-6 -right-6 w-32 h-40 bg-white p-2 rounded-sm shadow-2xl rotate-6 border border-gray-50">
                            <div className="w-full h-full bg-[#FDE2FF] rounded-sm flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-[#624da0]/40" />
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-12 max-w-md mx-auto bg-[#FFE2E2] text-[#624da0] px-6 py-4 rounded-sm text-sm font-bold border border-[#FFE2E2] text-center shadow-lg animate-bounce">
                        <span className="flex items-center justify-center gap-2">
                             <Check className="w-4 h-4" /> {error}
                        </span>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}} />
        </div>
    );
}
