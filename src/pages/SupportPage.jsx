import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthorizeUrl } from '../utils/auth';
import { ChevronDown, Lock, Sparkles, X } from 'lucide-react';
import ImaginationBanner from '../components/ImaginationBanner';

export default function SupportPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        if (!user) {
            setShowLoginModal(true);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        if (!category || !message.trim()) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    category,
                    message
                })
            });

            const data = await response.json();
            if (response.ok) {
                setSubmitted(true);
            } else {
                alert(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Support Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen">
                <div className="pt-32 pb-20 px-4">
                    <div className="max-w-md mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Sparkles className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Message Received!</h1>
                        <p className="text-gray-600 leading-relaxed">
                            Thank you for reaching out. We've received your request and our team will get back to you at <strong>{user?.email}</strong> as soon as possible.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 text-[#624da0] font-semibold hover:gap-3 transition-all cursor-pointer"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
                <ImaginationBanner />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Login Required Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-sm p-8 max-w-sm w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300 relative">
                        <button 
                            onClick={() => {
                                setShowLoginModal(false);
                                navigate(-1);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="w-20 h-20 bg-[#FDE2FF] rounded-sm flex items-center justify-center mx-auto">
                            <Lock className="w-10 h-10 text-[#2563EB]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">Login to Contact Us</h3>
                            <p className="text-gray-500 font-medium">Please login to send your message. This helps us track your request and get back to you faster.</p>
                        </div>
                        <button 
                            onClick={async () => {
                                try {
                                    const url = await getAuthorizeUrl();
                                    window.location.href = url;
                                } catch (err) {
                                    console.error("Login redirect failed:", err);
                                }
                            }}
                            className="w-full bg-[#2563EB] text-white py-4 rounded-sm font-bold hover:bg-[#1d4ed8] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Sparkles className="w-5 h-5" /> Sign In
                        </button>
                    </div>
                </div>
            )}

            <div className="relative bg-white pt-24 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-100/70 via-purple-50/40 to-transparent pointer-events-none" />
                
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
                     <div className="text-center mb-12">
                        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            Support Center
                        </h1>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We're here to help you create more magical moments. Send us a message and we'll get back to you shortly.</p>
                    </div>

                    <div className="bg-white rounded-sm shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative z-20">
                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            {/* Left Side: Info */}
                            <div className="w-full md:w-5/12 p-8 md:p-12 bg-gray-50/50">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-outfit">How can we help?</h2>
                                        <p className="text-gray-500 text-sm leading-relaxed">Select a category and describe your issue. Our team is available 24/7 for you.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <Sparkles className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">Order Tracking</h4>
                                                <p className="text-xs text-gray-500">Get updates on your magical book's journey.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                <Lock className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">Account Support</h4>
                                                <p className="text-xs text-gray-500">Secure access and profile help.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <div className="w-full md:w-7/12 p-8 md:p-12">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="relative">
                                        <select
                                            required
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className={`w-full bg-gray-50/50 border border-gray-200 rounded-md px-4 py-3.5 appearance-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all cursor-pointer ${category === '' ? 'text-gray-400' : 'text-gray-900'}`}
                                        >
                                            <option value="" disabled>Select a category...</option>
                                            <option value="order">Order Status</option>
                                            <option value="delivery">Delivery Issues</option>
                                            <option value="product">Product Feedback</option>
                                            <option value="personalisation">Personalisation Help</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            required
                                            rows="6"
                                            placeholder="Enter your message here..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-sm px-4 py-3.5 text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all resize-none placeholder-gray-400"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-sm transition-colors shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ImaginationBanner />
        </div>
    );
}
