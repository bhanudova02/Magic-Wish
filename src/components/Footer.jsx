import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopifyFetch, customerCreateMutation } from '../utils/shopify';
import { useAuth } from '../context/AuthContext';
import { getAuthorizeUrl } from '../utils/auth';
import { X, Lock, Sparkles } from 'lucide-react';

const Instagram = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Facebook = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const Twitter = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

export default function Footer() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            const data = await shopifyFetch({
                query: customerCreateMutation,
                variables: {
                    input: {
                        email: email,
                        password: `News-${Math.random().toString(36).slice(-8)}!`,
                        acceptsMarketing: true
                    }
                }
            });

            if (data.customerCreate.customerUserErrors.length > 0) {
                const error = data.customerCreate.customerUserErrors[0];
                if (error.code === 'TAKEN') {
                    setStatus('success'); // Already exists, so we call it a win
                } else {
                    setErrorMsg(error.message);
                    setStatus('error');
                }
            } else {
                setStatus('success');
                setEmail('');
            }
        } catch (error) {
            console.error("Newsletter error:", error);
            setStatus('error');
            setErrorMsg("Something went wrong. Please try again.");
        }
    };

    const handleProtectedLink = (e, path) => {
        e.preventDefault();
        if (user) {
            navigate(path);
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <footer className="bg-[#1a0b2e] border-t border-purple-900/30 text-gray-300 pt-16 pb-10 relative">
            {/* Login Required Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-sm p-8 max-w-sm w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300 relative">
                        <button 
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="w-20 h-20 bg-[#FDE2FF] rounded-sm flex items-center justify-center mx-auto">
                            <Lock className="w-10 h-10 text-[#2563EB]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">Login Required</h3>
                            <p className="text-gray-500 font-medium">Please login to view your account details and track your orders.</p>
                        </div>
                        <div className="space-y-3">
                            <button 
                                onClick={async () => {
                                    try {
                                        const url = await getAuthorizeUrl();
                                        window.location.href = url;
                                    } catch (err) {
                                        console.error("Login redirect failed:", err);
                                    }
                                }}
                                className="w-full bg-[#2563EB] text-white py-4 rounded-sm font-bold hover:bg-[#1d4ed8] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Sparkles className="w-5 h-5" /> Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="font-heading font-bold text-xl text-white">MagicWish</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Creating magical, personalised storybooks where your child is the hero. Printed with care, delivered with joy.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-600 hover:text-white transition duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#5e2ca0] hover:text-white transition duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky-500 hover:text-white transition duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">About MagicWish</h3>
                        <ul className="space-y-4">
                            <li><Link to="/contact" className="text-gray-400 hover:text-white hover:underline transition">Contact us</Link></li>
                            <li><Link to="/#faq" className="text-gray-400 hover:text-white hover:underline transition">FAQs</Link></li>
                            <li><Link to="/support" className="text-gray-400 hover:text-white hover:underline transition">Support</Link></li>
                        </ul>
                    </div>

                    {/* Client Area */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Client Area</h3>
                        <ul className="space-y-4">
                            <li><a href="/profile" onClick={(e) => handleProtectedLink(e, '/profile')} className="text-gray-400 hover:text-white hover:underline transition cursor-pointer">My Account</a></li>
                            <li><a href="/profile" onClick={(e) => handleProtectedLink(e, '/profile')} className="text-gray-400 hover:text-white hover:underline transition cursor-pointer">Orders</a></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-white hover:underline transition">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-white hover:underline transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Subscribe to Our Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-4">Don’t miss out on the newest books and exclusive discounts.</p>
                        <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                className="bg-white/10 border border-white/10 outline-none focus:ring-2 focus:ring-[#5e2ca0] text-white rounded-sm px-4 py-3 w-full placeholder-white/40 cursor-text" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                                required 
                            />
                            <button 
                                type="submit" 
                                className={`bg-[#5e2ca0] hover:bg-[#5e2ca0] text-white px-6 py-3 rounded-sm font-bold transition w-full cursor-pointer flex items-center justify-center gap-2 ${status === 'loading' ? 'opacity-70 cursor-wait' : ''}`}
                                disabled={status === 'loading' || status === 'success'}
                            >
                                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Thank you!' : 'Subscribe'}
                            </button>
                            {status === 'error' && <p className="text-red-400 text-xs mt-1">{errorMsg}</p>}
                            {status === 'success' && <p className="text-green-400 text-xs mt-1">Hooray! Expect some magic in your inbox.</p>}
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-center items-center">
                    <p className="text-sm text-gray-500">&copy; 2026 MagicWish. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
