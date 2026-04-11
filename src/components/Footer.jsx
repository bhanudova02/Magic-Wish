import React from 'react';

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
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 pt-16 pb-10">
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
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">About MagicWish</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-white hover:underline transition">Contact us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white hover:underline transition">FAQs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white hover:underline transition">Support</a></li>
                        </ul>
                    </div>

                    {/* Client Area */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Client Area</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-white hover:underline transition">My Account</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white hover:underline transition">Orders</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white hover:underline transition">Terms & Conditions</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white hover:underline transition">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Subscribe to Our Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-4">Don’t miss out on the newest books and exclusive discounts.</p>
                        <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Email address" className="bg-gray-800 border-none outline-none focus:ring-2 focus:ring-pink-500 text-white rounded-lg px-4 py-3 w-full" required />
                            <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold transition">
                                Subscribe
                            </button>
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
