import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronRight, ChevronDown, ChevronUp, CheckCircle2, Book, GraduationCap, Eye, ArrowRight } from 'lucide-react';
import { shopifyFetch, getProductQuery } from '../utils/shopify';
import { useCart } from '../context/CartContext';
import PersonalizationSection from '../components/PersonalizationSection';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('how-it-works');
    const [openAccordion, setOpenAccordion] = useState('personalization');
    const [showSticky, setShowSticky] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const ctaRef = useRef(null);
    const personalizationRef = useRef(null);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchBook() {
            setLoading(true);
            try {
                const data = await shopifyFetch({
                    query: getProductQuery,
                    variables: { handle: id }
                });
                
                const node = data.product;
                if (!node) {
                    setBook(null);
                    setLoading(false);
                    return;
                }
                
                const variant = node.variants.edges[0]?.node;
                const priceMatch = variant?.price?.amount || 0;
                const compareAtMatch = variant?.compareAtPrice?.amount || priceMatch;

                let badge = "";
                if (parseFloat(compareAtMatch) > parseFloat(priceMatch)) {
                    const discount = Math.round(((parseFloat(compareAtMatch) - parseFloat(priceMatch)) / parseFloat(compareAtMatch)) * 100);
                    badge = `-${discount}% OFF`;
                }

                const tags = node.tags || [];
                const age = tags.find(tag => tag.includes('-')) || '2-4';
                
                const formattedBook = {
                    productId: node.id,
                    id: node.handle,
                    variantId: variant?.id,
                    image: node.images.edges[0]?.node?.url || '',
                    images: node.images.edges.map(e => e.node.url),
                    title: node.title,
                    description: node.description,
                    price: `$${priceMatch}`,
                    priceAmount: parseFloat(priceMatch),
                    currencyCode: variant?.price?.currencyCode || 'USD',
                    originalPrice: parseFloat(compareAtMatch) > parseFloat(priceMatch) ? `$${compareAtMatch}` : null,
                    badge,
                    age,
                    coverpagePrompt: node.coverpage_prompt?.value || ''
                };
                
                setBook(formattedBook);
                setActiveImage(formattedBook.image);
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBook();
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowSticky(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (ctaRef.current) {
            observer.observe(ctaRef.current);
        }

        return () => {
            if (ctaRef.current) {
                observer.unobserve(ctaRef.current);
            }
        };
    }, [book]);

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const scrollToPersonalization = () => {
        personalizationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen pt-24 pb-20 animate-pulse">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-gray-100 rounded-sm aspect-square w-full"></div>
                        <div className="space-y-6">
                            <div className="h-10 bg-gray-100 rounded-full w-3/4"></div>
                            <div className="h-4 bg-gray-100 rounded-full w-1/4"></div>
                            <div className="h-20 bg-gray-50 rounded-sm w-full mt-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center px-4">
                    <h2 className="text-2xl font-black text-[#2b124c] mb-2">Adventure Not Found</h2>
                    <p className="text-gray-500 mb-6">We couldn't find the magical story you're looking for.</p>
                    <Link to="/books" className="inline-block bg-[#6366f1] text-white px-8 py-4 rounded-xl font-black">Back to Books</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start xl:gap-20">
                    {/* Left Column: Gallery */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Thumbnails */}
                        <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
                            {book.images.map((img, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#6366f1] shadow-lg scale-95' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Spotlight */}
                        <div className="flex-1 order-1 md:order-2">
                             <div className="relative aspect-square md:aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden group shadow-2xl border-4 border-white ring-1 ring-gray-100">
                                <img src={activeImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                {book.badge && (
                                    <div className="absolute top-6 left-6 bg-purple-600 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                                        {book.badge}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <div className="flex items-center gap-1.5 mb-4">
                                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">2,400+ Happy Explorers</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-4">{book.title}</h1>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed">{book.description}</p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Ages <span className="text-indigo-600">{book.age}</span></span>
                            </div>
                            <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Teaches <span className="text-purple-600">Values</span></span>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-4 py-2 border-y border-gray-50">
                            <span className="text-5xl font-black text-gray-900">{book.price}</span>
                            {book.originalPrice && (
                                <span className="text-xl text-gray-300 font-bold line-through">{book.originalPrice}</span>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="space-y-6" ref={ctaRef}>
                            <button 
                                onClick={scrollToPersonalization}
                                className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white py-6 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 hover:-translate-y-1 active:scale-95"
                            >
                                Personalise My Book <ArrowRight className="w-6 h-6" />
                            </button>
                            
                            <div className="flex flex-wrap justify-center items-center gap-4 opacity-50 grayscale">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
                            </div>
                        </div>

                        {/* Accordion */}
                        <div className="mt-4 space-y-4">
                            {[
                                { id: 'ship', title: 'Shipping & Delivery', content: 'Each book is custom-made. Production takes 2-3 days, followed by 3-5 days delivery.' },
                                { id: 'quality', title: 'Size & Quality', content: '21cm x 21cm, 30 premium pages, 200gsm silk paper with a durable laminated cover.' }
                            ].map((item) => (
                                <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => toggleAccordion(item.id)}
                                        className="w-full flex items-center justify-between px-6 py-5 text-left font-black text-gray-800 uppercase tracking-widest text-[11px]"
                                    >
                                        <span>{item.title}</span>
                                        {openAccordion === item.id ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                                    </button>
                                    {openAccordion === item.id && (
                                        <div className="px-6 pb-6 text-gray-500 font-medium text-sm leading-relaxed">
                                            {item.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Personalization Section Container */}
                <div ref={personalizationRef} className="mt-32 -mx-4 sm:-mx-6 lg:-mx-8 scroll-mt-24">
                    <PersonalizationSection book={book} />
                </div>
            </div>

            {/* Sticky Mobile CTA */}
            <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-[100] lg:hidden transition-all duration-500 transform ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <button 
                    onClick={scrollToPersonalization}
                    className="w-full bg-[#6366f1] text-white py-4 rounded-xl font-black text-base active:scale-95 transition-transform"
                >
                    Personalise My Book
                </button>
            </div>
        </div>
    );
}
