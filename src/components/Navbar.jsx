import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav 
            id="navbar" 
            className={`fixed w-full z-50 glass-nav transition-all duration-300 ${scrolled ? 'shadow-sm bg-white/95' : 'bg-white/85'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <span className="font-heading font-extrabold text-2xl tracking-tight text-gray-900">MagicWish</span>
                    </div>
                    <div className="hidden md:flex ml-10 space-x-8 items-center font-medium text-gray-600">
                        <a href="#" className="hover:text-pink-500 transition-colors">Home</a>
                        <a href="#books" className="hover:text-pink-500 transition-colors">Books</a>
                        <a href="#stickers" className="hover:text-pink-500 transition-colors">Stickers</a>
                        <a href="#support" className="hover:text-pink-500 transition-colors">Support</a>
                    </div>
                    <div className="flex items-center space-x-5 border-l border-gray-200 pl-6 ml-4">
                        <button className="text-gray-800 hover:text-pink-500 transition-colors focus:outline-none">
                            <Search className="w-6 h-6" />
                        </button>
                        <button className="text-gray-800 hover:text-pink-500 transition-colors focus:outline-none">
                            <ShoppingBag className="w-6 h-6" />
                        </button>
                        <button className="text-gray-800 hover:text-pink-500 transition-colors focus:outline-none">
                            <User className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="md:hidden flex items-center ml-4">
                        <button className="text-gray-800 hover:text-pink-500 focus:outline-none">
                            <Menu className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
