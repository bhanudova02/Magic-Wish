import React from 'react';
import imgBanner from '../assets/images/transformation_banner.png';

export default function ImaginationBanner() {
    return (
        <section className="">
            <div className="">
                <div className="relative flex flex-col md:flex-row min-h-[500px] overflow-hidden shadow-2xl shadow-purple-200">

                    {/* Left Side: Image */}
                    <div className="md:w-1/2 relative h-[350px] md:h-auto">
                        <img
                            src={imgBanner}
                            alt="Child reading a book"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Wavy Divider */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-16 -ml-8 z-20 pointer-events-none">
                        <svg
                            className="h-full w-full fill-[#B197FF]"
                            viewBox="0 0 100 1000"
                            preserveAspectRatio="none"
                        >
                            <path d="M100,0 L100,1000 L50,1000 C60,990 60,980 50,970 C40,960 40,950 50,940 C60,930 60,920 50,910 C40,900 40,890 50,880 C60,870 60,860 50,850 C40,840 40,830 50,820 C60,810 60,800 50,790 C40,780 40,770 50,760 C60,750 60,740 50,730 C40,720 40,710 50,700 C60,690 60,680 50,670 C40,660 40,650 50,640 C60,630 60,620 50,610 C40,600 40,590 50,580 C60,570 60,560 50,550 C40,540 40,530 50,520 C60,510 60,500 50,490 C40,480 40,470 50,460 C60,450 60,440 50,430 C40,420 40,410 50,400 C60,390 60,380 50,370 C40,360 40,350 50,340 C60,330 60,320 50,310 C40,300 40,290 50,280 C60,270 60,260 50,250 C40,240 40,230 50,220 C60,210 60,200 50,190 C40,180 40,170 50,160 C60,150 60,140 50,130 C40,120 40,110 50,100 C60,90 60,80 50,70 C40,60 40,50 50,40 C60,30 60,20 50,10 C40,0 40,-10 50,0 Z" />
                        </svg>
                    </div>

                    {/* Mobile Divider (Horizontal) */}
                    <div className="md:hidden absolute top-[350px] left-0 right-0 h-12 -mt-6 z-20 overflow-hidden">
                        <div className="flex w-[200%] animate-[slide_3s_linear_infinite]">
                            {[...Array(40)].map((_, i) => (
                                <div key={i} className="w-12 h-12 bg-[#B197FF] rounded-full mx-[-6px]"></div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="md:w-1/2 bg-[#B197FF] p-10 md:p-20 flex flex-col justify-center items-start text-white relative z-10">
                        <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-8 leading-tight tracking-tight">
                            Bring your child's imagination to life!
                        </h2>
                        <p className="text-white/95 text-xl md:text-2xl mb-12 max-w-lg font-medium leading-relaxed">
                            Make them the hero of their own magical adventure with a hyper-personalised storybook!
                        </p>
                        <a
                            href="/books"
                            className="bg-white text-[#B197FF] hover:bg-gray-50 px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-95 shadow-lg shadow-purple-900/20"
                        >
                            View All Books
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
