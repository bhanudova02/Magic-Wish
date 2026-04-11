import React from 'react';
import { ArrowRight } from 'lucide-react';
import BookCard from './BookCard';
import bookPrincess from '../assets/images/book_princess.png';
import bookDino from '../assets/images/book_dinosaur.png';
import bookSpace from '../assets/images/book_space.png';

const bestsellerData = [
    {
        id: 1,
        image: bookPrincess,
        title: "Princess and the Glowing Flower",
        description: "A magical journey of kindness and bravery in an enchanted forest.",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "-50% OFF"
    },
    {
        id: 2,
        image: bookDino,
        title: "Boy The Dinos Need You",
        description: "Bravery and friendship roar in this thrilling prehistoric adventure!",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "-50% OFF"
    },
    {
        id: 3,
        image: bookSpace,
        title: "The Boy and the Cosmic Journey",
        description: "Explore stars and planets with a friendly glowing space dragon.",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "-50% OFF"
    },
    {
        id: 4,
        title: "Personalised Sticker Packs",
        description: "Add a magical custom touch to their school bags and belongings.",
        price: "$9.99",
        originalPrice: "$19.99",
        buttonText: "View Packs",
        isStickerPack: true
    }
];

export default function Bestsellers() {
    return (
        <section id="books" className="pt-14 pb-10 md:py-20 bg-white border-b-2 border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-3 px-1">
                    <div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                            Personalise a bestseller
                        </h2>
                        <p className="text-gray-500 text-lg">Choose from our most loved magical adventures.</p>
                    </div>
                    <a href="#" className="hidden md:flex text-pink-500 font-bold hover:text-pink-600 transition items-center gap-1 group">
                        View All <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bestsellerData.map((book) => (
                        <BookCard key={book.id} {...book} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <a href="#" className="inline-flex text-pink-500 font-bold hover:text-pink-600 transition items-center gap-1 bg-pink-50 px-6 py-3 rounded-full">
                        View All Books <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
