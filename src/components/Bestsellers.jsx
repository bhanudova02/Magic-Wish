import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from './BookCard';
import SkeletonCard from './SkeletonCard';
import { getShopifyBooks } from '../utils/shopify';



export default function Bestsellers() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getShopifyBooks().then(allBooks => {
            const bestsellers = allBooks.filter(b => b.tags && b.tags.includes('bestseller')).slice(0, 3);
            setBooks(bestsellers.length > 0 ? bestsellers : allBooks.slice(0, 3)); // Fallback if no tags added yet
            setLoading(false);
        });
    }, []);

    return (
        <section id="books" className="pt-14 pb-10 md:pb-20 md:pt-14 bg-white border-b-2 border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-3 px-1">
                    <div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                            Personalise a bestseller
                        </h2>
                        <p className="text-gray-500 text-lg">Choose from our most loved magical adventures.</p>
                    </div>
                    <Link to="/books" state={{ selectedCategory: 'bestseller' }} className="hidden md:flex text-purple-600 font-bold hover:text-purple-700 transition items-center gap-1 group">
                        View All <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => <SkeletonCard key={i} />)
                    ) : (
                        books.map((book) => (
                            <BookCard key={book.id} {...book} />
                        ))
                    )}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/books" state={{ selectedCategory: 'bestseller' }} className="inline-flex text-purple-600 font-bold hover:text-purple-700 transition items-center gap-1 bg-purple-50 px-6 py-3 rounded-full">
                        View All Books <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
