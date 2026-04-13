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
                const desc = (parsedData.description || "").substring(0, 150);
                const finalPrompt = `Professional storybook cover titled "${title}". ${desc}. The hero is a ${parsedData.age} year old child named ${parsedData.name}. Scene: ${parsedData.coverpagePrompt}. Magical fantasy, vibrant 8k`;
                
                const seed = Math.floor(Math.random() * 999999);
                const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
                
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
                            console.log("AI Image Permanent URL Saved");
                            setGeneratedImage(cloudResult.secure_url);
                        }
                    }
                } catch (err) {
                    console.warn("Could not save AI image to Cloudinary:", err);
                }
            };

            generateImage();
        } else {
            navigate('/books');
        }
        window.scrollTo(0, 0);
    }, [navigate]);

    const handleImageLoad = () => {
        setProgress(100);
        setTimeout(() => setIsGenerating(false), 500);
    };

    const handleImageError = () => {
        setIsGenerating(false);
        if (personalization?.photo) {
            setGeneratedImage(personalization.photo);
            setError("AI is taking longer. Previewing with your photo!");
        } else {
            setError("Unable to load preview.");
        }
    };

    if (!personalization) return null;

    const handleAddToCart = () => {
        const attributes = [
            { key: "Child Name", value: personalization?.name || "" },
            { key: "Child Age", value: String(personalization?.age || "") },
            { key: "Language", value: personalization?.language || "English" },
            { key: "Child Photo", value: personalization?.photo || "" },
            { key: "AI Cover URL", value: generatedImage || "" },
            { key: "Manufacturing Instruction", value: finalAIInstruction }
        ];

        addToCart({ 
            id: personalization.productId, 
            variantId: personalization.variantId, 
            title: personalization.title
        }, attributes);
    };

    const finalAIInstruction = `Professional storybook cover titled "${personalization?.title}". ${personalization?.description}. The hero is a ${personalization?.age} year old child named ${personalization?.name}. Scene: ${personalization?.coverpagePrompt}. Maintain a magical fantasy and vibrant 8k style.`;

    useEffect(() => {
        if (!isGenerating) {
            console.log("%cFinal AI Manufacturing Instruction:", "color: #a21caf; font-weight: bold; font-size: 14px;");
            console.log(finalAIInstruction);
        }
    }, [isGenerating, finalAIInstruction]);

    return (
        <div className="bg-white min-h-screen flex flex-col relative overflow-hidden font-sans">
            {/* Ambient Blurred Background */}
            <div className="fixed inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-[100px] opacity-20 transition-all duration-1000"
                    style={{ backgroundImage: `url(${generatedImage || personalization?.photo})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80"></div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative z-10 pt-20 pb-32">
                <div className="relative group w-full max-w-[500px]">
                    <div className="absolute -inset-4 bg-black/10 blur-3xl rounded-[3rem] -z-10"></div>
                    
                    <div className="relative aspect-[4/5] bg-white rounded-[1.5rem] shadow-2xl border-x-[12px] border-white overflow-hidden ring-1 ring-black/5 flex flex-col items-center justify-center">
                        {isGenerating && (
                            <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-8 space-y-12">
                                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Your story is coming together...</h2>
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-3xl bg-gray-50 overflow-hidden relative border-4 border-white shadow-xl ring-1 ring-purple-100">
                                        {personalization?.photo ? (
                                            <img src={personalization.photo} className="w-full h-full object-cover" alt="Hero" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-purple-50">
                                                <User className="w-12 h-12 text-purple-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="w-16 h-16 text-white opacity-40 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="absolute -inset-4 border-[3px] border-purple-50 border-t-purple-600 rounded-full animate-spin"></div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100 text-sm font-black text-gray-600">
                                    Please wait.
                                    <div className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-[11px]">
                                        {Math.max(0, 30 - Math.floor((progress / 100) * 30))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            {generatedImage && (
                                <img 
                                    src={generatedImage} 
                                    alt="Book Preview" 
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating ? 'scale-110 blur-xl grayscale' : 'scale-100 blur-0 grayscale-0'}`}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-100 py-6 px-4 md:px-12 flex items-center justify-between">
                <div className="hidden md:flex items-center flex-1 max-w-2xl px-8">
                    <div className="flex-1 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black text-purple-600 uppercase tracking-widest border-b-4 border-purple-600 pb-1">Book</span>
                    </div>
                    <div className="w-32 h-[1px] bg-purple-100 mx-4"></div>
                    <div className="flex-1 flex-row items-center gap-2 flex">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${isGenerating ? 'bg-gray-200' : 'bg-purple-600'}`}>
                            <span className="text-[10px] font-black">{isGenerating ? '2' : <Check className="w-3.5 h-3.5" />}</span>
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest border-b-4 pb-1 ${isGenerating ? 'text-gray-400 border-gray-100' : 'text-purple-600 border-purple-600'}`}>Preview</span>
                    </div>
                </div>
                <div className="flex-1 md:flex-none flex items-center justify-end">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isGenerating}
                        className={`min-w-[160px] md:min-w-[200px] py-4 px-8 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${isGenerating ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-indigo-100 hover:-translate-y-1'}`}
                    >
                        {isGenerating ? 'Processing...' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
