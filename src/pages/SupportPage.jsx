import React, { useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';
import ImaginationBanner from '../components/ImaginationBanner';
import imgSupport from '../assets/images/support_3d_m.png';

export default function SupportPage() {
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');

    return (
        <div className="bg-[#fafafa] min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Support Header */}
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2b124c]">Support</h1>
                </div>

                {/* Main Support Card */}
                <div className="bg-white rounded-[2rem] border border-pink-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden mb-20 max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Side */}
                        <div className="md:w-1/2 bg-[#f8f7ff] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-pink-50">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-pink-200/20 rounded-full blur-2xl group-hover:bg-pink-300/30 transition duration-700"></div>
                                <img 
                                    src={imgSupport} 
                                    alt="MagicWish Support" 
                                    className="relative z-10 w-full max-w-sm drop-shadow-2xl transform group-hover:scale-105 transition duration-500 ease-out"
                                />
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <h2 className="font-heading text-3xl font-bold text-[#2b124c] mb-2">How can we help?</h2>
                            <p className="text-gray-500 mb-8">Let us know if there is anything we can do for you</p>

                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                {/* Category Dropdown */}
                                <div className="relative">
                                    <select 
                                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all text-gray-600 font-medium"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="" disabled>Select a category...</option>
                                        <option value="order">Order Status</option>
                                        <option value="delivery">Delivery Issues</option>
                                        <option value="product">Product Feedback</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Message Textarea */}
                                <div>
                                    <textarea 
                                        rows="5"
                                        placeholder="Enter your message here..."
                                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all text-gray-700 resize-none font-medium"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button 
                                        type="submit"
                                        className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-pink-200 transform transition hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                                    >
                                        Submit
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Banner */}
            </div>
                <ImaginationBanner />
        </div>
    );
}
