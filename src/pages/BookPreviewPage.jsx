import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BookPreviewPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [personalization, setPersonalization] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isGenerating, setIsGenerating] = useState(true);
    const [generatedCover, setGeneratedCover] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('last_personalization');
        if (data) {
            const parsedData = JSON.parse(data);
            setPersonalization(parsedData);
            
            // Generate AI Image
            const generateAIImage = async () => {
                setIsGenerating(true);
                try {
                    const prompt = parsedData.coverpagePrompt || "magical enchanted forest, vibrant colors";
                    const seed = Math.floor(Math.random() * 1000000);
                    // Using Pollinations.ai for free AI image generation
                    const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ", high quality book cover art, magical fantasy style, vibrant colors, " + parsedData.name)}?width=1024&height=1024&seed=${seed}&nologo=true`;
                    
                    // Preload the image
                    const img = new Image();
                    img.src = aiImageUrl;
                    img.onload = () => {
                        setGeneratedCover(aiImageUrl);
                        setIsGenerating(false);
                    };
                } catch (error) {
                    console.error("AI Generation failed:", error);
                    setIsGenerating(false);
                }
            };

            generateAIImage();
        } else {
            navigate('/books');
        }
        window.scrollTo(0, 0);
    }, [navigate]);

    if (!personalization) return null;

    const handleAddToCart = () => {
        // Here you would normally pass the personalization data to the cart
        // For now, we'll just add the product to cart
        addToCart({ 
            id: personalization.productId || 'the-boy-and-the-cosmic-journey', 
            variantId: personalization.variantId, 
            title: personalization.title
        });
    };

    const slides = [
        { type: 'cover', title: 'Front Cover' },
        { type: 'page1', title: 'Personalized Intro' },
        { type: 'page2', title: 'Adventure Begins' }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="bg-[#fdf2f8] min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 font-bold hover:text-purple-600 transition group w-fit"
                    >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-purple-50 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        Back to Edit
                    </button>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold text-sm">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            Personalization Protected
                        </div>
                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Preview Ready
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Interactive Preview Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl shadow-purple-200/50 border border-purple-50 relative overflow-hidden aspect-[4/3] flex items-center justify-center">
                            
                            {/* AI Generating Overlay */}
                            {isGenerating && (
                                <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 text-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-600 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900">Generating Magic...</h3>
                                        <p className="text-gray-500 font-medium">Creating a unique world for <span className="text-purple-600 font-bold">{personalization.name}</span></p>
                                    </div>
                                </div>
                            )}

                            {/* Slide Content */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                {currentSlide === 0 ? (
                                    /* Front Cover Preview */
                                    <div className="relative w-[85%] h-[90%] bg-purple-600 rounded-sm shadow-2xl overflow-hidden group">
                                        {/* Book Texture Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent z-10"></div>
                                        
                                        {/* AI Generated Cover Image (Background) */}
                                        <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: `url(${generatedCover || 'https://images.unsplash.com/photo-1618519764620-7403abdb0991?q=80&w=1200&h=1200&auto=format&fit=crop'})` }}></div>
                                        <div className="absolute inset-0 bg-black/30 z-0"></div>

                                        {/* Personalized Content */}
                                        <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center text-white">
                                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-white shadow-2xl overflow-hidden mb-8 transform -rotate-3 transition group-hover:rotate-0 duration-700">
                                                <img 
                                                    src={personalization.photo} 
                                                    alt="Child" 
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            </div>
                                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase italic mb-4 drop-shadow-lg">
                                                Super <span className="text-yellow-400">{personalization.name || 'Hero'}</span>
                                            </h1>
                                            <p className="text-xl md:text-2xl font-bold opacity-90 drop-shadow-md">{personalization.title || 'Adventure Begins'}</p>
                                        </div>

                                        {/* Spine Detail */}
                                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/10 z-30"></div>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <ImageIcon className="w-20 h-20 text-purple-100 mx-auto" />
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">Inside Page Preview</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">This page will feature <span className="text-purple-600 font-bold">{personalization.name}</span> in a magical adventure!</p>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Arrows */}
                            <button 
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-400 hover:text-purple-600 transition"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-400 hover:text-purple-600 transition"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                {slides.map((_, i) => (
                                    <div key={i} className={`h-2 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-purple-600' : 'w-2 bg-purple-200'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary & Checkout */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-50 space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">Order Summary</h2>
                            
                            <div className="space-y-4 border-b border-gray-100 pb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold">Child's Name</span>
                                    <span className="text-purple-600 font-black tracking-wide uppercase">{personalization.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold">Age</span>
                                    <span className="text-gray-900 font-black">{personalization.age} Years</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold">Language</span>
                                    <span className="text-gray-900 font-black">{personalization.language}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Total Price</span>
                                    <div className="text-right">
                                        <span className="block text-3xl font-black text-gray-900">$29.99</span>
                                        <span className="text-[10px] text-green-500 font-black uppercase tracking-wider">Free Shipping Included</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full bg-[#a21caf] hover:bg-[#86198f] text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-200 mt-4"
                                >
                                    Add to Cart <ShoppingCart className="w-6 h-6" />
                                </button>
                                
                                <p className="text-center text-[10px] text-gray-400 font-medium">Ready to ship in 2-3 business days</p>
                            </div>
                        </div>

                        {/* Customer Reviews/Trust */}
                        <div className="bg-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-1 mb-4">
                                    {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-4 h-4 text-yellow-300 fill-current" />)}
                                </div>
                                <p className="font-bold text-lg leading-relaxed mb-4">"The quality surpassed my expectations. My daughter's face on the cover looks incredible!"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20"></div>
                                    <div>
                                        <h4 className="font-black text-sm uppercase">Sarah J.</h4>
                                        <p className="text-xs opacity-70">Verified Parent</p>
                                    </div>
                                </div>
                            </div>
                            <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
