import React from 'react';
import stepPick from '../assets/images/steps/step_pick.png';
import stepPhoto from '../assets/images/steps/step_photo.png';
import stepPreview from '../assets/images/steps/step_preview.png';
import stepDelivery from '../assets/images/steps/step_delivery.png';

const steps = [
    {
        id: 1,
        title: "Pick Storybook",
        image: stepPick,
        color: "#E0EBFF",
        badge: "bg-blue-100 text-blue-600"
    },
    {
        id: 2,
        title: "Add your Child's Picture",
        image: stepPhoto,
        color: "#FDE2FF",
        badge: "bg-purple-100 text-purple-700"
    },
    {
        id: 3,
        title: "Preview & Order",
        image: stepPreview,
        color: "#FFE2E2",
        badge: "bg-red-100 text-red-600"
    },
    {
        id: 4,
        title: "Joyful Delivery",
        image: stepDelivery,
        color: "#E2E0FF",
        badge: "bg-purple-100 text-purple-600"
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative pt-14 pb-14 md:pt-20 md:pb-24 bg-white overflow-hidden border-b-2 border-gray-100">
            {/* Suitable Magical Background Shade */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-100/70 via-purple-50/40 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-blue-200/20" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20 md:mb-24">
                    <h2 className="font-heading text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
                        HOW MAGICWISH WORKS
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
                        Pick a theme, upload a photo, and watch the magic happen as your child becomes the hero of their very own storybook adventure.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 lg:gap-y-0 lg:gap-x-4 relative">
                        {steps.map((step, index) => (
                            <div 
                                key={step.id} 
                                className={`flex flex-col items-center text-center transition-all duration-700 ${
                                    index % 2 === 0 ? 'lg:-translate-y-8' : 'lg:translate-y-8'
                                }`}
                            >
                                {/* Step Image with Soft Magical Blob Shape */}
                                <div className="relative group mb-8">
                                    <div className="absolute inset-0 scale-150 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                            <path 
                                                fill={step.color} 
                                                d="M150.3,55.4C168.2,74.6,180.1,98.6,175.7,119.5C171.3,140.4,150.6,158.2,127.8,168.3C105,178.4,80.1,180.8,58.3,172.3C36.5,163.8,17.8,144.4,10.5,121.5C3.2,98.6,7.3,72.2,22.2,51.8C37.1,31.4,62.8,17,87.8,16.2C112.8,15.4,132.4,36.2,150.3,55.4Z" 
                                            />
                                        </svg>
                                    </div>

                                    {/* Image Container */}
                                    <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center p-4">
                                        <div className="w-full h-full bg-white rounded-2xl shadow-2xl p-2 transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 overflow-hidden flex items-center justify-center border border-gray-100">
                                            <img 
                                                src={step.image} 
                                                alt={step.title} 
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Step Label */}
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${step.badge}`}>
                                        {step.id}
                                    </span>
                                    <h4 className="font-heading font-black text-gray-900 text-lg md:text-xl uppercase tracking-tighter">
                                        {step.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />
        </section>
    );
}
