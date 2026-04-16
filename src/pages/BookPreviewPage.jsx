import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2, User, Calendar, Globe, Terminal, X, Check, ArrowRight, BookOpen, Clock, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createFaceSwapJob, getJobStatus } from '../utils/magichour';



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
        return `Professional storybook cover titled "${data.title}" for ${data.name} (${data.age} years old). Style: Magical fantasy and vibrant 8k. (Face swap applied via Magic Hour using original book cover).`;
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
        setProgress(5);
        
        try {
            const { photo, bookCover } = parsedData;
            
            if (!photo || !bookCover) {
                throw new Error("Missing photo or book cover for personalization.");
            }

            // Start Magic Hour Job
            const jobRes = await createFaceSwapJob(photo, bookCover);
            const projectId = jobRes.id;

            if (!projectId) {
                throw new Error("Failed to initialize magic generation.");
            }

            // Polling for completion
            let jobDone = false;
            let checkCount = 0;
            const maxChecks = 60; // 3 minutes max (3s interval)
            let magicUrl = null;

            while (!jobDone && checkCount < maxChecks) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // Poll every 3s
                checkCount++;
                
                const statusRes = await getJobStatus(projectId);
                const status = statusRes.status;

                // Update progress
                setProgress(prev => Math.min(prev + 5, 90));

                if (status === 'complete' || status === 'completed') {
                    jobDone = true;
                    // Usually assets is populated upon completion
                    magicUrl = statusRes.downloads?.[0]?.url || statusRes.assets?.[0]?.url || statusRes.url || statusRes.image_url;
                } else if (status === 'failed' || status === 'error') {
                    throw new Error("Face swap generation failed.");
                }
            }
            
            if (!magicUrl) throw new Error("Could not retrieve generated image. Process timed out.");

            setGeneratedImage(magicUrl);
            
            // Now upload the final result to Cloudinary for persistence
            await uploadToCloudinary(magicUrl);

        } catch (err) {
            console.error("Personalization error:", err);
            setError(err.message || "An unexpected error occurred.");
            setIsGenerating(false);
            setIsUploading(false);
        }
    };

    const uploadToCloudinary = async (imageUrl) => {
        try {
            setIsUploading(true);
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            
            if (cloudName && preset) {
                const response = await fetch(imageUrl);
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
                    setIsGenerating(false);
                    setProgress(100);
                    
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
            // Even if Cloudinary fails, we can still use the Magic Hour URL
            setCloudinaryUrl(imageUrl);
            setIsGenerating(false);
            setProgress(100);
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
        <div className="bg-[#E0EBFF] min-h-screen flex flex-col items-center justify-center pt-24 lg:pt-32 pb-12 px-4 lg:px-8 overflow-hidden relative">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDE2FF] rounded-sm mix-blend-multiply filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E2E0FF] rounded-sm mix-blend-multiply filter blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left side: Book Information */}
                    <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-right duration-700 order-2 lg:order-2">
                        <div className="space-y-6">

                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                Your Magical <br />
                                <span className="text-[#624da0]">Book Preview Ready</span>
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                                We've customized the cover specifically for <span className="text-[#624da0] font-bold">{personalization?.name}</span>. 
                                Take a look at how the book will appear before finalizing your order.
                            </p>
                        </div>

                        <div className="hidden lg:block space-y-4">
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

                        {/* Order Summary Card */}
                        <div className="bg-white rounded-sm p-4 shadow-xl shadow-blue-100/50 border border-blue-50 space-y-3">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Personalization Details</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                                <div className="flex flex-col gap-1 min-w-0">
                                    <p className="text-[10px] font-black text-[#624da0]/60 uppercase tracking-widest whitespace-nowrap">Child's Name</p>
                                    <p className="text-xs font-black text-gray-900 truncate">{personalization?.name}</p>
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <p className="text-[10px] font-black text-[#624da0]/60 uppercase tracking-widest whitespace-nowrap">Language</p>
                                    <p className="text-xs font-black text-gray-900">{personalization?.language}</p>
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <p className="text-[10px] font-black text-[#624da0]/60 uppercase tracking-widest whitespace-nowrap">Book Title</p>
                                    <p className="text-xs font-bold text-gray-700 truncate">{personalization?.title}</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right side: Interactive Book Mockup */}
                    <div className="lg:col-span-7 relative animate-in zoom-in duration-700 delay-200 max-w-[440px] mx-auto w-full order-1 lg:order-1 space-y-8">
                        <div className="relative">
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
                            {!isGenerating && !isUploading && generatedImage && (
                                <div className="hidden lg:block absolute -top-8 -right-8 w-32 h-40 bg-white p-2 rounded-sm shadow-2xl rotate-6 border border-gray-50 animate-in fade-in slide-in-from-top-4 duration-700 delay-500">
                                    <div className="w-full h-full bg-[#FDE2FF] rounded-sm overflow-hidden shadow-inner">
                                        <img src={generatedImage} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" alt="Mini Preview" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Add to Cart Button */}
                        <div className="lg:hidden space-y-4">
                            <button 
                                onClick={handleAddToCart}
                                disabled={!canContinue}
                                className={`w-full py-5 rounded-sm font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${!canContinue ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#624da0] hover:bg-[#4d3a82] text-white shadow-xl shadow-purple-200/50 active:scale-95'}`}
                            >
                                {!canContinue ? (isUploading ? 'Securing Preview...' : 'Generating...') : 'Add to Cart'}
                                {canContinue && <ArrowRight className="w-6 h-6" />}
                                {!canContinue && <Loader2 className="w-6 h-6 animate-spin" />}
                            </button>
                            <p className="text-center text-[10px] font-bold text-gray-400 flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Premium Hardcover Print Quality Verified
                            </p>
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
