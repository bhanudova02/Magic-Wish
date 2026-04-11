import React from 'react';

export default function Hero() {
    return (
        <section className="flex flex-col lg:flex-row h-auto lg:h-[640px] w-full pt-16 bg-white overflow-hidden relative border-b-8 border-gray-100">
            {/* Left Area (Edge-to-Edge Premium Image Showcase) */}
            <div className="flex w-full lg:w-[55%] flex-shrink-0 lg:h-full h-[50vh] relative overflow-hidden bg-gray-100">
                <img 
                    src="/assets/images/hero_img.jpg" 
                    alt="Magical reading experience" 
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Right Area (Ultra-Modern Slant Split with Border Highlight) */}
            <div className="flex flex-col w-full lg:flex-1 relative z-10 lg:-ml-[80px]">
                {/* Bottom Layer: Dynamic Gradient Highlight Border */}
                <div className="absolute inset-0 w-full h-[calc(100%+60px)] -mt-[52px] lg:h-full lg:mt-0 left-0 lg:-left-[12px] z-0 [clip-path:polygon(0_40px,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(80px_0,100%_0,100%_100%,0_100%)] bg-gradient-to-b from-pink-400 via-purple-500 to-[#661399] shadow-2xl"></div>

                {/* Middle Layer: Crisp White Border */}
                <div className="absolute inset-0 w-full h-[calc(100%+60px)] -mt-[46px] lg:h-full lg:mt-0 left-0 lg:-left-[6px] z-10 [clip-path:polygon(0_40px,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(80px_0,100%_0,100%_100%,0_100%)] bg-white opacity-80 backdrop-blur-sm"></div>

                {/* Top Layer: Main Slanted Background */}
                <div 
                    className="absolute inset-0 w-full h-[calc(100%+60px)] -mt-[40px] lg:h-full lg:mt-0 z-20 [clip-path:polygon(0_40px,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(80px_0,100%_0,100%_100%,0_100%)]" 
                    style={{ background: 'linear-gradient(180deg, #F9DFFF 0%, #FAEDFF 100%)' }}>
                    
                    {/* Faint patterned background overlay - now nested to respect clip-path */}
                    <div 
                        className="absolute inset-0 opacity-10" 
                        style={{
                            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M0 20c11.046 0 20-8.954 20-20h-2c0 9.941-8.059 18-18 18v2zm20 20c11.046 0 20-8.954 20-20h-2c0 9.941-8.059 18-18 18v2z\\' fill=\\'%23661399\\' fill-opacity=\\'1\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')", 
                            backgroundSize: '40px 40px'
                        }}>
                    </div>
                </div>
                
                {/* Content Container */}
                <div className="flex flex-col justify-center items-start text-[#661399] px-10 py-12 sm:px-16 lg:px-16 lg:pl-28 z-30 w-full relative h-full gap-5">
                    <div>
                        <h3 className="text-[11px] md:text-[13px] font-extrabold tracking-[3px] uppercase mb-4 text-[#7A1399]">SPARK THEIR IMAGINATION</h3>
                        <h1 className="font-heading font-extrabold text-[36px] sm:text-[44px] lg:text-[48px] xl:text-[54px] leading-[1.05] tracking-tight text-[#661399]">
                            Spin enchanting<br/> tales starring your<br/> little one
                        </h1>
                    </div>
                    
                    <div className="mt-4">
                        <a href="#books" className="bg-white hover:bg-gray-50 text-[#661399] font-bold py-4 px-10 text-md rounded transition-colors inline-block tracking-wide shadow-sm">
                            View All Books
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
