import React from 'react';
import { ArrowRight } from 'lucide-react';
import BookCard from './BookCard';
import bookExplorer from '../assets/images/book_explorer.png';
import bookOcean from '../assets/images/book_ocean.png';
import bookPaintbrush from '../assets/images/book_paintbrush.png';

const newReleasesData = [
    {
        id: 1,
        image: bookExplorer,
        title: "The Brave Little Explorer",
        description: "A daring journey through the Whispering Woods to find the lost star.",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "NEW"
    },
    {
        id: 2,
        image: bookOcean,
        title: "Guardians of the Ocean",
        description: "Dive deep into the blue and save the coral kingdom with your friends.",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "NEW"
    },
    {
        id: 3,
        image: bookPaintbrush,
        title: "The Magic Paintbrush",
        description: "Everything you paint comes to life! What will you create today?",
        price: "$14.99",
        originalPrice: "$39.99",
        badge: "NEW"
    }
];

export default function NewReleases() {
    return (
        <section id="new-releases" className="pt-14 pb-10 md:py-20 bg-gray-50/30 border-b-2 border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-3 px-1">
                    <div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                            Discover What’s New
                        </h2>
                        <p className="text-gray-500 text-lg">Fresh stories waiting for your magical touch.</p>
                    </div>
                    <a href="#" className="hidden md:flex text-pink-500 font-bold hover:text-pink-600 transition items-center gap-1 group">
                        View All <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newReleasesData.map((book) => (
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
