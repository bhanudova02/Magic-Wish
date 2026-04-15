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
    const [activeImage, setActiveImage] = useState(null);
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



    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const scrollToPersonalization = () => {
        const element = document.getElementById('upload-image-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            personalizationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen pt-24 pb-20 animate-pulse">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-center md:text-left">
                        {/* Left: Image Gallery Skeleton */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Thumbnails */}
                            <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1 overflow-hidden">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-sm flex-shrink-0" />
                                ))}
                            </div>
                            {/* Main Image */}
                            <div className="flex-1 order-1 md:order-2">
                                <div className="aspect-square md:aspect-[4/5] bg-gray-200 rounded-sm w-full shadow-sm" />
                            </div>
                        </div>

                        {/* Right: Info Skeleton */}
                        <div className="flex flex-col space-y-8">
                            <div>
                                <div className="h-12 bg-gray-200 rounded-sm w-3/4 mb-4" />
                                <div className="h-4 bg-gray-200 rounded-sm w-1/4" />
                            </div>

                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded-sm w-full" />
                                <div className="h-4 bg-gray-200 rounded-sm w-full" />
                                <div className="h-4 bg-gray-200 rounded-sm w-2/3" />
                            </div>

                            {/* Benefit Boxes Skeleton */}
                            <div className="bg-blue-50/50 p-6 rounded-sm space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm" />
                                        <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                                    </div>
                                ))}
                            </div>

                            {/* Price Skeleton */}
                            <div className="flex items-baseline gap-3">
                                <div className="h-10 bg-gray-200 rounded-sm w-32" />
                            </div>

                            {/* Button Skeleton */}
                            <div className="h-16 bg-gray-300 rounded-sm w-full" />

                            {/* Accordion Skeleton */}
                            <div className="space-y-3 pt-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-14 bg-gray-200 border border-gray-100 rounded-sm w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-[#2b124c] mb-2">Adventure Not Found</h2>
                    <p className="text-gray-500 mb-6 font-medium">We couldn't find the magical story you're looking for.</p>
                    <Link to="/books" className="text-blue-600 font-bold hover:underline">Back to Books</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
                            {(book.images && book.images.length > 0 ? book.images : [book.image]).map((imgStr, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setActiveImage(imgStr)}
                                    className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer rounded-sm overflow-hidden border-2 transition-all ${activeImage === imgStr ? 'border-purple-600 shadow-md' : 'border-gray-100 opacity-60'}`}
                                >
                                    <img src={imgStr} alt={`${book.title} ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 order-1 md:order-2">
                             <div className="relative aspect-square md:aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden group border border-gray-100 shadow-sm">
                                <img src={activeImage} alt={book.title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                                {book.badge && (
                                    <div className="absolute top-6 left-6 z-10 bg-[#5e2ca0] text-white text-sm font-black px-4 py-2 rounded-sm shadow-lg transform -rotate-3 uppercase tracking-wider">
                                        {book.badge}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-5xl font-extrabold text-[#2b124c] mb-4 tracking-tight leading-tight uppercase font-heading">{book.title}</h1>
                            <div className="flex items-center gap-3">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                                </div>
                                <span className="text-gray-500 text-sm font-medium">(4,283) Reviews</span>
                            </div>
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed font-medium">
                            {book.description || "When a dragon flies into a peaceful village, everyone is scared and hides. But one brave child notices that something is different. The dragon wasn't weird or dangerous, he was just lonely. By listening, helping, and being kind, fear turns into smiles, games, and a new, precious friendship."}
                        </p>

                        <div className="space-y-4 mb-8 bg-blue-50/50 p-6 rounded-sm border border-blue-100">
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 border border-blue-100">
                                     <CheckCircle2 className="w-5 h-5" />
                                 </div>
                                 <span className="font-medium">Perfect for kids ages <span className="text-blue-600 font-bold">{book.age} years old</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 border border-blue-100">
                                     <GraduationCap className="w-5 h-5" />
                                 </div>
                                 <span className="font-medium text-gray-900">Teaches <span className="text-blue-600 font-bold">courage & friendship</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 border border-blue-100">
                                     <Book className="w-5 h-5" />
                                 </div>
                                 <span className="font-medium"><span className="text-blue-600 font-bold">30</span> Beautifully illustrated pages</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 border border-blue-100">
                                     <Eye className="w-5 h-5" />
                                 </div>
                                 <span className="font-medium"><span className="text-blue-600 font-bold">Preview</span> available before ordering</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-gray-400 text-lg">From</span>
                            <span className="text-4xl font-black text-gray-900 font-heading">{book.price}</span>
                            {book.originalPrice && (
                                <span className="text-xl text-gray-400 line-through font-medium">{book.originalPrice}</span>
                            )}
                        </div>

                        <div className="space-y-6">
                            <button 
                                onClick={scrollToPersonalization}
                                className="w-full bg-[#5e2ca0] hover:bg-[#5e2ca0] text-white py-5 px-8 rounded-sm font-black text-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-lg"
                            >
                                Personalise My Book <ArrowRight className="w-6 h-6" />
                            </button>
                            
                         
                        </div>

                        <div className="mt-10 space-y-3">
                            {[
                                { id: 'personalization', title: 'How is the book personalized for my child?', content: 'You can choose your child\'s name, gender, skin tone, hairstyle, and even add a special dedication message at the beginning of the book.' },
                                { id: 'changes', title: 'What if I need to make changes after personalizing?', content: 'You will see a full digital preview before ordering. Once the order is placed, we start printing immediately, so please double-check everything in the preview!' },
                                { id: 'quality', title: 'Size & Quality', content: 'Our books are printed on high-quality 200gsm paper with a durable premium cover. Standard size is 21cm x 21cm, perfect for bedtime reading.' }
                            ].map((item) => (
                                <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => toggleAccordion(item.id)}
                                        className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-gray-900 transition hover:bg-gray-50"
                                    >
                                        <span>{item.title}</span>
                                        {openAccordion === item.id ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                    </button>
                                    {openAccordion === item.id && (
                                        <div className="px-6 pb-4 text-gray-600 leading-relaxed text-sm">
                                            {item.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div ref={personalizationRef} className="mt-20 -mx-4 sm:-mx-6 lg:-mx-8 scroll-mt-24">
                    <PersonalizationSection book={book} />
                </div>
            </div>


        </div>
    );
}
