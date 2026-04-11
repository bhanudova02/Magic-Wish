import React from 'react';
import { Link } from 'react-router-dom';

export default function ImaginationBanner() {
    return (
        <section className="w-full overflow-hidden">
            <div className="flex flex-col md:flex-row w-full min-h-[480px]">
                {/* Left side: Image */}
                <div className="w-full md:w-5/12 relative bg-gray-100 min-h-[350px] md:min-h-auto">
                    {/* Using the newly generated image for a child reading */}
                    <img 
                        src="/images/child_reading_banner.png" 
                        alt="Child reading a Magical Storybook" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                {/* Right side: Content with Indigo Background */}
                <div className="w-full md:w-7/12 bg-[#2563EB] relative flex items-center py-16 px-10 md:px-16 lg:px-24">
                    
                    {/* Clean Slanted Edge (Visible only on Desktop) */}
                    <div className="hidden md:block absolute top-0 bottom-0 left-0 w-6 -translate-x-[99%] overflow-hidden pointer-events-none">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[#2563EB] fill-current">
                            <polygon points="100,0 100,100 0,100" />
                        </svg>
                    </div>

                    <div className="relative z-10 w-full max-w-xl text-white">
                        <h2 className="text-4xl lg:text-[3rem] font-bold font-heading mb-8 tracking-tight leading-[1.1]">
                            Turn their dreams <br className="hidden xl:block"/> into a real story!
                        </h2>
                        
                        <p className="text-lg md:text-xl font-medium mb-12 leading-relaxed text-blue-50">
                            Cast your little one as the star of an <br className="hidden xl:block"/> enchanting, fully customized adventure book.
                        </p>
                        
                        <Link 
                            to="/books" 
                            className="inline-block bg-white text-[#2563EB] font-bold text-lg px-12 py-4 rounded-md focus:outline-none focus:ring-4 focus:ring-white/30 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            View All Books
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
