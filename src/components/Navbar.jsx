import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, LogOut, Home, HelpCircle } from 'lucide-react';
import { getShopifyBooks } from '../utils/shopify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getAuthorizeUrl } from '../utils/auth';
export default function Navbar() {
    const [books, setBooks] = useState([]);
    useEffect(() => { getShopifyBooks().then(setBooks); }, []);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { setIsCartOpen, getCartCount } = useCart();
    const { user, isAuthenticated, logoutUser } = useAuth();
    const location = useLocation();

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isProfileOpen && !e.target.closest('#profile-dropdown-container')) {
                setIsProfileOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [isProfileOpen]);

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

    const MobileNavLink = ({ to, icon: Icon, label, onClick }) => (
        <NavLink 
            to={to} 
            onClick={onClick}
        >
            {({ isActive }) => (
                <div className={`
                    flex items-center gap-4 px-4 py-4 rounded-sm transition-all duration-300 group
                    ${isActive ? 'bg-purple-50 text-purple-700 shadow-sm shadow-purple-100/50' : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'}
                `}>
                    <div className={`
                        w-10 h-10 rounded-sm flex items-center justify-center transition-colors
                        ${isActive ? 'bg-white text-purple-600 shadow-sm' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-purple-400 shadow-inner'}
                    `}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-md font-bold tracking-tight">{label}</span>
                </div>
            )}
        </NavLink>
    );

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
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Toggle (Left) */}
                            <div className="md:hidden flex items-center">
                                <button 
                                    onClick={() => setIsMenuOpen(true)}
                                    className="text-gray-800 hover:text-purple-600 focus:outline-none"
                                >
                                    <Menu className="w-7 h-7" />
                                </button>
                            </div>

                            <Link to="/" className="shrink-0 flex items-center gap-2 cursor-pointer">
                                <span className="font-heading font-extrabold text-2xl tracking-tight text-[#2b124c]">MagicWish</span>
                            </Link>
                        </div>
                        
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
                            <button 
                                onClick={() => setIsCartOpen(true)}
                                className="text-gray-800 hover:text-purple-600 transition-colors focus:outline-none cursor-pointer relative"
                            >
                                <ShoppingBag className="w-6 h-6" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>
                            <div id="profile-dropdown-container" className="relative">
                                {isAuthenticated ? (
                                    <>
                                        <button 
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="text-gray-800 hover:text-purple-600 transition-colors focus:outline-none cursor-pointer flex items-center justify-center p-1"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-extrabold text-[#2b124c] border border-blue-200 shadow-sm overflow-hidden pointer-events-none">
                                                {user.name?.[0]?.toUpperCase()}
                                            </div>
                                        </button>
                                        
                                        {/* Profile Dropdown Menu */}
                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200 z-[60]">
                                                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                                                    <p className="text-sm font-bold text-[#2b124c] truncate">{user.name}</p>
                                                </div>
                                                
                                                <Link 
                                                    to="/profile?tab=profile" 
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    My Profile
                                                </Link>
                                                <Link 
                                                    to="/profile?tab=orders" 
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                                                    My Orders
                                                </Link>
                                                <div className="h-px bg-gray-50 my-2"></div>
                                                <button 
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        logoutUser();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            try {
                                                const url = await getAuthorizeUrl();
                                                window.location.href = url;
                                            } catch (error) {
                                                console.error('Login error:', error);
                                            }
                                        }}
                                        className="text-gray-800 hover:text-purple-600 transition-colors focus:outline-none cursor-pointer flex items-center justify-center p-1"
                                    >
                                        <User className="w-6 h-6" />
                                    </button>
                                )}
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
                                        <Link key={book.id} to={`/books/${book.id}`} className="group space-y-2 block">
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
                                                <Link key={book.id} to={`/books/${book.id}`} className="group block mb-4">
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
            <div className={`fixed inset-0 z-[150] md:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-[#2b124c]/30 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>
                
                {/* Side Menu */}
                <div className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-[10px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] transform flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    {/* Menu Header */}
                    <div className="bg-[#fbfcff] px-6 pt-8 pb-6 border-b border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                                    <span className="font-heading font-black text-xl">M</span>
                                </div>
                                <span className="font-heading font-black text-2xl tracking-tight text-[#2b124c]">MagicWish</span>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-purple-600 bg-white rounded-full shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Navigation Items */}
                    <div className="flex-grow px-4 py-8 overflow-y-auto">
                        <div className="space-y-1">
                            <MobileNavLink to="/" icon={Home} label="Home" onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/books" icon={ShoppingBag} label="Books" onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/support" icon={HelpCircle} label="Support" onClick={() => setIsMenuOpen(false)} />
                        </div>
                        
                        <div className="mt-10 mb-4 px-2">
                            <div className="h-px bg-gray-100 w-full mb-6"></div>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 pl-2 italic">Account</p>
                            
                            {isAuthenticated ? (
                                <div className="space-y-1">
                                    <MobileNavLink to="/profile?tab=profile" icon={User} label="My Profile" onClick={() => setIsMenuOpen(false)} />
                                    <MobileNavLink to="/profile?tab=orders" icon={ShoppingBag} label="My Orders" onClick={() => setIsMenuOpen(false)} />
                                    <button 
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            logoutUser();
                                        }}
                                        className="w-full flex items-center gap-4 px-4 py-4 text-md font-bold text-red-500 hover:bg-red-50 rounded-sm transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-sm bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-100 transition-colors">
                                            <LogOut className="w-5 h-5" />
                                        </div>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={async () => {
                                        const url = await getAuthorizeUrl();
                                        window.location.href = url;
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-4 text-md font-bold text-blue-600 hover:bg-blue-50 rounded-sm transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center text-blue-400 group-hover:bg-blue-100 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <span>Sign In / Register</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer / Extra info */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center opacity-50">© 2024 MagicWish Store</p>
                    </div>
                </div>
            </div>
        </>
    );
}

