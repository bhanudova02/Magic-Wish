import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { books } from '../data/books';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle browser back button to close modals
    useEffect(() => {
        const handlePopState = (event) => {
            if (isMenuOpen || isSearchOpen) {
                // If modal is open, prevent default back and close modals
                setIsMenuOpen(false);
                setIsSearchOpen(false);
            }
        };

        if (isMenuOpen || isSearchOpen) {
            window.history.pushState({ modalOpen: true }, '');
        }

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isMenuOpen, isSearchOpen]);

    // Clear search query when modal opens
    useEffect(() => {
        if (isSearchOpen) {
            setSearchQuery('');
        }
    }, [isSearchOpen]);

    // Close menu/search when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setSearchQuery('');
    }, [location.pathname]);

    // Prevent scrolling when menu/search is open
    useEffect(() => {
        if (isMenuOpen || isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen, isSearchOpen]);

    const filteredBooks = searchQuery.trim() === '' 
        ? [] 
        : books.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const linkClass = ({ isActive }) => 
        `transition-colors font-medium ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'}`;

    const mobileLinkClass = ({ isActive }) => 
        `block py-4 text-xl font-bold border-b border-gray-100 ${isActive ? 'text-purple-700' : 'text-gray-800 hover:text-purple-600'}`;

    return (
        <>
            <nav 
                id="navbar" 
                className={`fixed w-full z-50 bg-white border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}
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
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="text-gray-800 hover:text-purple-600 transition-colors focus:outline-none cursor-pointer"
                            >
                                <Search className="w-6 h-6" />
                            </button>
                            <button className="text-gray-800 hover:text-purple-600 transition-colors focus:outline-none cursor-pointer">
                                <ShoppingBag className="w-6 h-6" />
                            </button>
                            <button className="text-gray-800 hover:text-purple-600 transition-colors focus:outline-none cursor-pointer">
                                <User className="w-6 h-6" />
                            </button>
                            <div className="md:hidden flex items-center ml-2 border-l border-gray-200 pl-4">
                                <button 
                                    onClick={() => setIsMenuOpen(true)}
                                    className="text-gray-800 hover:text-purple-600 focus:outline-none"
                                >
                                    <Menu className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Search Modal */}
            <div className={`fixed inset-0 z-[150] transition-all duration-300 ${isSearchOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop (Only for Desktop) */}
                <div 
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 hidden md:block ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsSearchOpen(false)}
                ></div>
                
                {/* Modal Container */}
                <div className={`absolute inset-0 md:inset-auto md:top-[5%] md:left-1/2 md:-translate-x-1/2 md:w-[90%] md:max-w-2xl md:max-h-[85vh] bg-white md:rounded-sm shadow-2xl transition-all duration-300 transform flex flex-col ${isSearchOpen ? 'translate-y-0 opacity-100' : 'md:-translate-y-10 translate-y-full opacity-0'}`}>
                    
                    {/* Search Header - Based on Image */}
                    <div className="flex items-center px-4 py-3 md:pt-6 md:px-6 border-b border-gray-100 md:border-none">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Search" 
                                className="w-full bg-white md:bg-gray-50 border-none md:border border-gray-100 rounded-lg py-3 pl-10 pr-4 text-md md:text-lg focus:outline-none md:focus:ring-2 md:focus:ring-blue-500/20 focus:bg-white transition-all transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsSearchOpen(false)}
                            className="ml-2 p-2 text-gray-400 hover:text-gray-900 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 md:pb-10 custom-scrollbar">
                        {!searchQuery ? (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-500 text-sm font-medium">Recently viewed</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {books.slice(0, 8).map(book => (
                                        <Link key={book.id} to={`/book/${book.id}`} className="group space-y-2 block">
                                            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative">
                                                <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] md:text-[11px] font-bold text-gray-900 uppercase leading-tight line-clamp-2 md:truncate h-[24px] md:h-auto">{book.title}</h4>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] md:text-[10px] text-gray-400 line-through leading-none mb-1">{book.originalPrice}</span>
                                                    <span className="text-[11px] md:text-[12px] text-gray-900 font-bold leading-none">{book.price}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-gray-900 text-sm font-bold uppercase tracking-widest text-[#2b124c]">Search Results ({filteredBooks.length})</h3>
                                    </div>
                                    
                                    {filteredBooks.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {filteredBooks.map(book => (
                                                <Link key={book.id} to={`/book/${book.id}`} className="group block mb-4">
                                                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-2">
                                                        <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                                    </div>
                                                    <h4 className="text-[11px] font-bold text-gray-900 uppercase leading-tight line-clamp-2">{book.title}</h4>
                                                    <p className="text-[12px] font-bold text-blue-600 mt-1">{book.price}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-8 h-8 text-gray-200" />
                                            </div>
                                            <p className="text-gray-400 font-medium">We couldn't find any magical tales matching your search.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Mobile Side Navigation Menu */}
            <div className={`fixed inset-0 z-[150] md:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
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
                                className="p-2 text-gray-500 hover:text-purple-600"
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

