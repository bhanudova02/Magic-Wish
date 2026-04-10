import React from 'react';

const HandDrawnArrow = ({ className, rotation = "0" }) => (
    <svg 
        viewBox="0 0 100 100" 
        className={`w-14 h-14 fill-none stroke-white stroke-[3] opacity-80 ${className}`}
        style={{ transform: `rotate(${rotation}deg)` }}
    >
        <path d="M20,80 Q40,40 80,20" />
        <path d="M65,15 L82,18 L78,35" />
    </svg>
);

const StyledImage = ({ src, size = "w-24 h-24", className }) => (
    <div className={`${size} rounded-[1.5rem] md:rounded-[2rem] border-4 border-white overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 ${className}`}>
        <img src={src} alt="Character Preview" className="w-full h-full object-cover" />
    </div>
);

export default function PhotoUploadBanner() {
    return (
        <section className="relative bg-[#E2E0FF] py-12 md:py-16 overflow-hidden">
            {/* Scalloped Top Decoration */}
            <div className="absolute top-0 left-0 w-full h-10 flex overflow-hidden">
                {[...Array(60)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-8 h-8 -mt-4 bg-white rounded-full mx-[-4px]"></div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-[#2b124c]">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                        Your child stars in every story!
                    </h2>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10">
                    
                    {/* Column 1: A Universe of Styles */}
                    <div className="relative flex flex-col items-center">
                        <div className="relative w-56 h-56">
                            <StyledImage 
                                src="/assets/images/avatar_style_1.png" 
                                size="w-32 h-32" 
                                className="absolute top-0 left-0 z-20"
                            />
                            <StyledImage 
                                src="/assets/images/Dino-LandExpedition.jpg" 
                                size="w-20 h-20" 
                                className="absolute top-8 right-0 z-10"
                            />
                            <StyledImage 
                                src="/assets/images/avatar_expression_1.png" 
                                size="w-24 h-24" 
                                className="absolute bottom-0 left-10 z-30"
                            />
                        </div>
                        <div className="mt-8 text-center group">
                            <HandDrawnArrow className="mx-auto -mb-4 -scale-x-100 rotate-[45deg] relative -top-3 !stroke-[#2b124c]" />
                            <p className="font-[Shadows_Into_Light] text-2xl md:text-3xl tracking-wide">A Universe of Styles</p>
                        </div>
                    </div>

                    {/* Column 2: Pure Emotion */}
                    <div className="relative flex flex-col items-center">
                        <p className="font-[Shadows_Into_Light] text-2xl md:text-3xl tracking-wide mb-4">Pure Emotion</p>
                        <div className="relative w-56 h-64">
                            <HandDrawnArrow className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-[120deg] !stroke-[#2b124c]" />
                            <StyledImage 
                                src="/assets/images/avatar_expression_2.png" 
                                size="w-16 h-16" 
                                className="absolute top-8 left-0 z-10"
                            />
                            <StyledImage 
                                src="/assets/images/avatar_expression_1.png" 
                                size="w-20 h-20" 
                                className="absolute top-16 right-0 z-20"
                            />
                            <StyledImage 
                                src="/assets/images/avatar_style_1.png" 
                                size="w-36 h-36" 
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30"
                            />
                        </div>
                    </div>

                    {/* Column 3: Dynamic Views */}
                    <div className="relative flex flex-col items-center justify-end">
                        <div className="relative w-56 h-56">
                            <StyledImage 
                                src="/assets/images/avatar_angle_1.png" 
                                size="w-16 h-16" 
                                className="absolute top-0 right-10 z-10"
                            />
                            <StyledImage 
                                src="/assets/images/TheSpeedsterofNeonCity.jpg" 
                                size="w-20 h-20" 
                                className="absolute bottom-1/2 left-0 z-20"
                            />
                            <StyledImage 
                                src="/assets/images/TheGalacticCommander.jpg" 
                                size="w-40 h-40" 
                                className="absolute bottom-0 right-0 z-30"
                            />
                        </div>
                        <div className="mt-8 text-center">
                            <HandDrawnArrow className="mx-auto -mb-4 rotate-[-30deg] relative -top-3 !stroke-[#2b124c]" />
                            <p className="font-[Shadows_Into_Light] text-2xl md:text-3xl tracking-wide">Dynamic Views</p>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
}

