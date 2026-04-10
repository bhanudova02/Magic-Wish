import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FaqItem = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center py-5 md:py-6 text-left focus:outline-none group"
            >
                <span className={`text-lg md:text-xl font-bold transition-colors ${
                    isOpen ? 'text-pink-600' : 'text-gray-900 hover:text-pink-600'
                }`}>
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-pink-600" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-pink-600" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default function Faq() {
    const [activeIndex, setActiveIndex] = useState(0);

    const faqData = [
        {
            question: "How do I place an order?",
            answer: "Simply pick a storybook, upload your child's photo and name, and watch as they become the hero! Once you're happy with the preview, just add to cart and checkout."
        },
        {
            question: "Do you ship to my location?",
            answer: "MagicWish ships to over 50 countries worldwide including the US, UK, Canada, Australia, and India. You can see the full list during checkout."
        },
        {
            question: "Can I get a refund for my order?",
            answer: "Because each book is custom-printed for your child, we can only offer refunds or replacements for manufacturing defects or shipping damage."
        },
        {
            question: "How long does shipping take?",
            answer: "Usually, it takes 2-3 business days for production and 7-12 business days for standard shipping depending on your location."
        },
        {
            question: "Will I have to pay duties or extra fees?",
            answer: "Most of our local manufacturing partners help avoid customs fees, but international orders may occasionally incur small import duties depending on your country."
        },
        {
            question: "What if I’m not happy with my order?",
            answer: "Your satisfaction is our priority! If there's any issue with your book, please contact our support team and we'll do everything we can to fix it."
        },
        {
            question: "How can I reach customer support?",
            answer: "You can reach us 24/7 via email at hello@magicwish.com or through our live chat right here on the website."
        },
        {
            question: "What languages are your books available in?",
            answer: "Currently, our magical stories are available in English, Spanish, French, and German, with more languages coming very soon!"
        }
    ];

    return (
        <section id="faq" className="py-20 md:py-28 bg-indigo-50/40 overflow-hidden border-b-2 border-gray-100">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-6">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-500 text-lg">Everything you need to know about MagicWish.</p>
                </div>

                <div className="space-y-1">
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={index}
                            {...item}
                            isOpen={activeIndex === index}
                            onToggle={() => setActiveIndex(activeIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
