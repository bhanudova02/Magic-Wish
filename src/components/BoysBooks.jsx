import React from 'react';
import { ArrowRight } from 'lucide-react';
import BookCard from './BookCard';
import adventuresSpace from '../assets/images/adventures_space.webp';
import adventuresDino from '../assets/images/adventures_dino.webp';
import adventuresRace from '../assets/images/adventures_race.webp';

const boysBooksData = [
    {
        id: 1,
        image: adventuresSpace,
        title: "The Galactic Commander",
        description: "Zoom past planets and stars in a high-tech rocket ship built just for you.",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "-50% OFF"
    },
    {
        id: 2,
        image: adventuresDino,
        title: "Dino-Land Expedition",
        description: "Become a brave explorer and discover hidden fossils in a prehistoric world.",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "-50% OFF"
    },
    {
        id: 3,
        image: adventuresRace,
        title: "The Speedster of Neon City",
        description: "Race against the clock in the world's fastest car to win the Grand Prix.",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "-50% OFF"
    }
];

export default function BoysBooks() {
    return (
        <section id="boys-books" className="pt-14 pb-10 md:py-20 bg-gray-50/50 border-b-2 border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-3 px-1">
                    <div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                            Books for Your Little Boy!
                        </h2>
                        <p className="text-gray-500 text-lg">Every boy is the hero of his own epic adventure.</p>
                    </div>
                    <a href="#" className="hidden md:flex text-blue-500 font-bold hover:text-blue-600 transition items-center gap-1 group">
                        View All <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {boysBooksData.map((book) => (
                        <BookCard key={book.id} {...book} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <a href="#" className="inline-flex text-blue-500 font-bold hover:text-blue-600 transition items-center gap-1 bg-blue-50 px-6 py-3 rounded-full">
                        View All Boys' Books <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
