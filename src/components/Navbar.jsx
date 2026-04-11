import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const linkClass = ({ isActive }) => 
        `transition-colors font-medium ${isActive ? 'text-pink-600' : 'text-gray-600 hover:text-pink-500'}`;

    const mobileLinkClass = ({ isActive }) => 
        `block py-4 text-xl font-bold border-b border-gray-100 ${isActive ? 'text-pink-600' : 'text-gray-800 hover:text-pink-500'}`;

    return (
        <>
            <nav 
                id="navbar" 
                className={`fixed w-full z-50 glass-nav transition-all duration-300 ${scrolled ? 'shadow-sm bg-white/95' : 'bg-white/85'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="shrink-0 items-center gap-2 cursor-pointer">
                            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#2b124c]">MagicWish</span>
                        </Link>
                        
                        {/* Desktop Menu */}
                        <div className="hidden md:flex ml-10 space-x-8 items-center font-medium">
                            <NavLink to="/" className={linkClass}>Home</NavLink>
                            <NavLink to="/books" className={linkClass}>Books</NavLink>
                            <NavLink to="/support" className={linkClass}>Support</NavLink>
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
                            <div className="md:hidden flex items-center ml-2 border-l border-gray-200 pl-4">
                                <button 
                                    onClick={() => setIsMenuOpen(true)}
                                    className="text-gray-800 hover:text-pink-500 focus:outline-none"
                                >
                                    <Menu className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Side Navigation Menu */}
            <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>
                
                {/* Side Menu */}
                <div className={`absolute top-0 right-0 h-full w-[80%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full bg-white">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <span className="font-heading font-extrabold text-xl text-[#2b124c]">Menu</span>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-gray-500 hover:text-pink-500"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="flex-grow px-6 py-8 overflow-y-auto">
                            <nav className="flex flex-col">
                                <NavLink to="/" className={mobileLinkClass}>Home</NavLink>
                                <NavLink to="/books" className={mobileLinkClass}>Books</NavLink>
                                <NavLink to="/support" className={mobileLinkClass}>Support</NavLink>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
