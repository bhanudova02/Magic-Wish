import React from 'react';
import { Star, Sticker, Sparkles } from 'lucide-react';

const BookCard = ({ 
    image, 
    title, 
    description, 
    price, 
    originalPrice, 
    badge, 
    buttonText = "Personalise",
    isStickerPack = false
}) => {
    return (
        <div className="book-card bg-white rounded-lg p-4 border border-pink-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full relative group">
            {badge && (
                <div className="absolute top-6 left-6 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-black px-3 py-1.5 rounded-md shadow-[0_5px_15px_rgba(239,68,68,0.4)] transform -rotate-3 overflow-hidden">
                    {badge}
                </div>
            )}
            
            <div className={`aspect-square rounded-none rounded-tr-3xl rounded-br-3xl overflow-hidden mb-6 relative ${isStickerPack ? 'bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center border border-pink-100 inset-0 group-hover:from-pink-100 transition-colors duration-500' : ''}`}>
                {isStickerPack ? (
                    <div className="text-center p-6 relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute -top-6 -left-6 text-pink-400 opacity-50 transform -rotate-12"><Star className="w-10 h-10 fill-current" /></div>
                        <div className="absolute -bottom-6 -right-6 text-purple-400 opacity-50 transform rotate-45"><Sparkles className="w-12 h-12" /></div>
                        
                        <div className="w-20 h-20 bg-white rounded-t-[1rem] rounded-bl-[1.5rem] rounded-br-[0.5rem] flex items-center justify-center mx-auto mb-6 shadow-md text-pink-500 transform rotate-3">
                            <Sticker className="w-10 h-10" />
                        </div>
                        <h4 className="font-extrabold text-gray-800 text-2xl font-heading mb-2">Sticker Packs</h4>
                        <p className="text-sm text-gray-500 text-center">Customised with their name!</p>
                    </div>
                ) : (
                    <>
                        <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out" />
                    </>
                )}
            </div>

            <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-2 leading-tight group-hover:text-pink-500 transition-colors">{title}</h3>
            <p className="text-gray-500 mb-6 text-sm flex-grow">{description}</p>
            
            <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex flex-col">
                    {originalPrice && (
                        <span className="text-xs text-gray-400 line-through leading-none">{originalPrice}</span>
                    )}
                    <span className="text-xl font-bold text-gray-900 leading-none">{price}</span>
                </div>
                <a href="#" className="py-3 px-10 bg-gray-50 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 text-gray-900 hover:text-white text-center font-bold rounded-sm transition-all duration-300 border border-pink-100 hover:border-transparent text-lg whitespace-nowrap">
                    {buttonText}
                </a>
            </div>
        </div>
    );
};

export default BookCard;
