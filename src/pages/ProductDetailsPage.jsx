import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronRight, ChevronDown, ChevronUp, CheckCircle2, Book, GraduationCap, Eye } from 'lucide-react';
import { books } from '../data/books';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [activeTab, setActiveTab] = useState('how-it-works');
    const [openAccordion, setOpenAccordion] = useState('personalization');
    const [showSticky, setShowSticky] = useState(false);
    const ctaRef = React.useRef(null);

    useEffect(() => {
        const foundBook = books.find(b => b.id === parseInt(id));
        setBook(foundBook);
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

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500">Book not found...</p>
            </div>
        );
    }

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-sm border-2 cursor-pointer overflow-hidden transition ${i === 1 ? 'border-blue-600' : 'border-gray-100 hover:border-blue-300'}`}>
                                    <img src={book.image} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="flex-1 order-1 md:order-2 bg-gray-50 rounded-sm overflow-hidden aspect-square border border-gray-100 shadow-sm relative group">
                             <img src={book.image} alt={book.title} className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105" />
                             {book.badge && (
                                <div className="absolute top-6 left-6 z-10 bg-[#2e71eb] text-white text-sm font-black px-4 py-2 rounded-sm shadow-lg transform -rotate-3 uppercase tracking-wider">
                                    {book.badge}
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                                {book.title}
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                                </div>
                                <span className="text-gray-500 text-sm font-medium">(4,283) Reviews</span>
                            </div>
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {book.description || "When a dragon flies into a peaceful village, everyone is scared and hides. But one brave child notices that something is different. The dragon wasn't weird or dangerous, he was just lonely. By listening, helping, and being kind, fear turns into smiles, games, and a new, precious friendship."}
                        </p>

                        {/* Features List */}
                        <div className="space-y-4 mb-8 bg-blue-50/50 p-6 rounded-sm border border-blue-100">
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 border border-blue-100">
                                     <CheckCircle2 className="w-5 h-5 text-green-500" />
                                 </div>
                                 <span className="font-medium">Perfect for kids ages <span className="text-blue-600 font-bold">{book.age} years old</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 border border-blue-100">
                                     <GraduationCap className="w-5 h-5" />
                                 </div>
                                 <span className="font-medium">Teaches <span className="text-blue-600 font-bold">courage & friendship</span></span>
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
                            <span className="text-4xl font-black text-gray-900">{book.price}</span>
                            {book.originalPrice && (
                                <span className="text-xl text-gray-400 line-through font-medium">{book.originalPrice}</span>
                            )}
                        </div>

                        {/* CTA Section */}
                        <div className="space-y-6" ref={ctaRef}>
                            <button className="w-full bg-[#2e71eb] hover:bg-[#2f6fe7] text-white py-5 px-8 rounded-sm font-black text-xl transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-500/20 active:scale-95">
                                Personalise my book
                            </button>
                            
                            {/* Payment Icons */}
                            <div className="flex flex-wrap justify-center items-center gap-4 py-4 border-y border-gray-100">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-70 grayscale hover:grayscale-0 transition" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-70 grayscale hover:grayscale-0 transition" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 opacity-70 grayscale hover:grayscale-0 transition" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Pay_logo_2020.svg" alt="GPay" className="h-5 opacity-70 grayscale hover:grayscale-0 transition" />
                            </div>
                        </div>

                        {/* Accordions */}
                        <div className="mt-10 space-y-3">
                            {[
                                { id: 'personalization', title: 'How is the book personalized for my child?', content: 'You can choose your child\'s name, gender, skin tone, hairstyle, and even add a special dedication message at the beginning of the book.' },
                                { id: 'changes', title: 'What if I need to make changes after personalizing?', content: 'You will see a full digital preview before ordering. Once the order is placed, we start printing immediately, so please double-check everything in the preview!' },
                                { id: 'quality', title: 'Size & Quality', content: 'Our books are printed on high-quality 200gsm paper with a durable premium cover. Standard size is 21cm x 21cm, perfect for bedtime reading.' }
                            ].map((item) => (
                                <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden">
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
            </div>

            {/* Mobile/Tablet Sticky CTA */}
            <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-[100] lg:hidden transition-all duration-300 transform ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <button className="w-full bg-[#2e71eb] text-white py-4 rounded-sm font-black text-lg shadow-lg active:scale-95 transition-transform">
                    Personalise my book
                </button>
            </div>
        </div>
    );
}
