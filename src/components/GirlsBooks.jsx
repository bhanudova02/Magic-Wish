import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import BookCard from './BookCard';
import { getShopifyBooks } from '../utils/shopify';



export default function GirlsBooks() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getShopifyBooks().then(allBooks => {
            const girlsBooks = allBooks.filter(b => b.gender === 'girl' || b.gender === 'unisex').slice(0, 3);
            setBooks(girlsBooks.length > 0 ? girlsBooks : allBooks.slice(0, 3));
        });
    }, []);

    return (
        <section id="girls-books" className="pt-14 pb-10 md:pt-20 md:pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-3 px-1">
                    <div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                            Books for Your Little Girl!
                        </h2>
                        <p className="text-gray-500 text-lg">Every girl is the hero of her own magical story.</p>
                    </div>
                    <a href="#" className="hidden md:flex text-purple-600 font-bold hover:text-purple-700 transition items-center gap-1 group">
                        View All <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book) => (
                        <BookCard key={book.id} {...book} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <a href="#" className="inline-flex text-purple-600 font-bold hover:text-purple-700 transition items-center gap-1 bg-purple-50 px-6 py-3 rounded-full">
                        View All Girls' Books <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
