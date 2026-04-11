import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ImaginationBanner from '../components/ImaginationBanner';

export default function SupportPage() {
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !message.trim()) return;
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen">
            <div className="relative bg-white pt-24 pb-20 overflow-hidden">
                {/* Suitable Magical Background Shade (HowItWorks style) */}
                <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-100/70 via-purple-50/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-blue-200/20" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center z-10">
                    <h1 className="font-heading text-4xl lg:text-5xl mb-8 text-gray-900 font-bold leading-tight w-full text-center">
                        Support
                    </h1>
                    <div className="w-full bg-white p-8 md:p-12 lg:p-16 rounded-md shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-200 relative z-20">
                        {submitted ? (
                            <div className="text-center py-16 px-6">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Message Sent</h3>
                                <p className="text-gray-500 mb-8">We have received your message and will get back to you shortly.</p>
                                <button
                                    onClick={() => { setSubmitted(false); setCategory(''); setMessage(''); }}
                                    className="text-white bg-black hover:bg-gray-900 font-medium px-6 py-3 rounded-md transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center md:items-start">
                                {/* Left Side: Text */}
                                <div className="w-full md:w-5/12 md:pt-4 text-center md:text-left">
                                    <h1 className="font-heading text-4xl lg:text-5xl mb-4 text-gray-900 font-bold leading-tight">
                                        How can <br className="hidden md:block"/> we help?
                                    </h1>
                                    <p className="text-gray-600 text-lg md:text-xl mb-6">
                                        Have a question or need assistance? We're always here to help make your experience magical.
                                    </p>

                                    <div className="flex items-center justify-center md:justify-start gap-3 text-[#2563EB] font-medium mt-6">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <a href="mailto:support@magicwish.in" className="hover:text-blue-800 transition-colors">
                                            support@magicwish.in
                                        </a>
                                    </div>
                                </div>

                                {/* Right Side: Form */}
                                <div className="w-full md:w-7/12">
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

                                        <div>
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
                                            className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-sm transition-colors shadow-md hover:shadow-lg active:scale-[0.99]"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Imagination Banner ── */}

            </div>
            <ImaginationBanner />
        </div>
    );
}
