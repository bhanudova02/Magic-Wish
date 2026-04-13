import React from 'react';
import { Upload, Check, X, Lock, Sparkles, Image as ImageIcon, Printer } from 'lucide-react';

export default function PersonalizationSection() {
    return (
        <section className="bg-[#fdf2f8] py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left side: Information & Steps */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                Start Personalising
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                                Personalise your storybook by uploading your child's photo. 
                                Preview the book, place your order, we'll print 
                                and deliver it to your home.
                            </p>
                        </div>

                        {/* Steps Visual */}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center bg-white shadow-sm">
                                        <Upload className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-[#fdf2f8]">
                                        1
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 leading-tight">Upload Child's Picture</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center bg-white shadow-sm overflow-hidden">
                                        <Sparkles className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-[#fdf2f8]">
                                        2
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 leading-tight">Preview Book and Order</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center bg-white shadow-sm">
                                        <Printer className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-[#fdf2f8]">
                                        3
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 leading-tight">Premium Print, Delivered to Your Door</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Upload Card */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-purple-200/50 border border-purple-50 relative z-10">
                            {/* Tips Header */}
                            <div className="text-center mb-8">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">TIPS</h3>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 flex flex-col items-center gap-2">
                                        <div className="relative">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-green-500 p-0.5">
                                                <img src="https://images.unsplash.com/photo-1544126592-807daa215a05?q=80&w=200&h=200&auto=format&fit=crop" alt="Good" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight">Clear front-facing photo</span>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center gap-2">
                                        <div className="relative opacity-60">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-red-500 p-0.5">
                                                <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=200&h=200&auto=format&fit=crop" alt="Bad" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-white">
                                                <X className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 leading-tight">No eating or covered face</span>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center gap-2">
                                        <div className="relative opacity-60">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-red-500 p-0.5">
                                                <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=200&h=200&auto=format&fit=crop" alt="Bad" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-white">
                                                <X className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 leading-tight">No accessories</span>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center gap-2">
                                        <div className="relative opacity-60">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-red-500 p-0.5">
                                                <img src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=200&h=200&auto=format&fit=crop" alt="Bad" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-white">
                                                <X className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 leading-tight">No far away or side angle</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Button */}
                            <div className="space-y-4">
                                <button className="w-full bg-[#a21caf] hover:bg-[#86198f] text-white py-5 px-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-200">
                                    Child's Photo <Upload className="w-6 h-6" />
                                </button>
                                <p className="text-center text-sm font-bold text-gray-400">drop a photo or click on the button</p>
                            </div>

                            <button className="w-full mt-6 py-4 px-6 rounded-2xl border-2 border-purple-100 hover:border-purple-200 flex items-center justify-center gap-2 text-purple-600 font-bold text-sm transition-colors group">
                                <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors" />
                                Photo Formats & Dimensions Info
                            </button>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-8 flex items-center justify-center gap-3 text-gray-500">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-gray-700">Private and secure, no third-party data use.</p>
                                <p className="text-[10px] text-gray-400 font-medium leading-none mt-1">Your images and information stay protected.</p>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
