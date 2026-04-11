import React from 'react';

/**
 * PHOTO UPLOAD BANNER - IMAGE GENERATION PROMPTS
 * Use these prompts in an external AI generator to replace current placeholders with 9 unique images.
 * 
 * --- MANY STYLES (Themes & Costumes) ---
 * 1. MAGICAL PRINCESS: "A charming 5-year-old girl in a beautiful emerald green royal dress, standing in an enchanted castle forest with a small cat and fox. Pixar-style 3D, magical lighting, cinematic."
 * 2. PINK FAIRY: "A young girl with wings dressed as a pink magical fairy, in a dreamy glowing garden with butterflies. 3D animated style, vibrant and whimsical."
 * 3. HALLOWEEN FUN: "A young child in a cute pumpkin/Halloween costume, standing in a spooky but friendly moonlit yard with Jack-o'-lanterns. 3D Pixar-style."
 * 
 * --- FULL OF EXPRESSIONS (Dynamic Settings) ---
 * 4. CARNIVAL JOY: "A young girl with a look of pure excitement and joy, laughing at a colorful carnival circus with red and white tents in the background. 3D animated style, high energy."
 * 5. JUNGLE EXPLORER: "A young boy with a curious expression, standing in a lush green jungle with giant leaves and glowing plants. Pixar-style, cinematic depth."
 * 6. WINTER WONDER: "A young girl wearing a warm red winter coat, catching a snowflake with a look of wonder. Snowy forest background, 3D animated style."
 * 
 * --- DIFFERENT ANGLES (Poses & Actions) ---
 * 7. OVER-THE-SHOULDER: "A young girl looking back over her shoulder with a sweet smile, standing in a lush terrace garden with greenery. 3D Pixar-style, soft lighting."
 * 8. BOTANICAL GARDEN: "A young girl in a yellow dress standing in a vibrant botanical garden filled with flowers and parrots. 3D animated style, bright colors."
 * 9. LITTLE BUILDER: "A young boy in an orange construction vest and hat, helping a friendly builder on a sunny construction site with yellow machinery. Dynamic 3D Pixar-style."
 */

import imgPrincess from '../assets/images/banner/banner_princess.webp';
import imgFairy from '../assets/images/banner/banner_fairy.webp';
import imgHalloween from '../assets/images/banner/banner_halloween.webp';
import imgCarnival from '../assets/images/banner/banner_carnival.webp';
import imgJungle from '../assets/images/banner/banner_jungle.webp';
import imgWinter from '../assets/images/banner/banner_winter.webp';
import imgGardenSide from '../assets/images/banner/banner_shoulder.webp';
import imgGardenFront from '../assets/images/banner/banner_garden.webp';
import imgBuilder from '../assets/images/banner/banner_builder.webp';

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
                        <div className="relative w-72 h-72">
                            <StyledImage 
                                src={imgPrincess} 
                                size="w-40 h-40" 
                                className="absolute top-0 left-0 z-20"
                            />
                            <StyledImage 
                                src={imgFairy} 
                                size="w-28 h-28" 
                                className="absolute top-8 right-0 z-10"
                            />
                            <StyledImage 
                                src={imgHalloween} 
                                size="w-32 h-32" 
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
                        <div className="relative w-72 h-80">
                            <HandDrawnArrow className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-[120deg] !stroke-[#2b124c]" />
                            <StyledImage 
                                src={imgCarnival} 
                                size="w-32 h-32" 
                                className="absolute top-8 left-0 z-10"
                            />
                            <StyledImage 
                                src={imgJungle} 
                                size="w-36 h-36" 
                                className="absolute top-4 -right-4 z-20"
                            />
                            <StyledImage 
                                src={imgWinter} 
                                size="w-44 h-44" 
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30"
                            />
                        </div>
                    </div>

                    {/* Column 3: Dynamic Views */}
                    <div className="relative flex flex-col items-center justify-end">
                        <div className="relative w-72 h-72">
                            <StyledImage 
                                src={imgGardenSide} 
                                size="w-32 h-32" 
                                className="absolute -top-10 right-10 z-10"
                            />
                            <StyledImage 
                                src={imgGardenFront} 
                                size="w-28 h-28" 
                                className="absolute bottom-1/2 left-0 z-20"
                            />
                            <StyledImage 
                                src={imgBuilder} 
                                size="w-48 h-48" 
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

