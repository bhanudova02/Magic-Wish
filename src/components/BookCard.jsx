import React from 'react';

const BookCard = ({ 
    image, 
    title, 
    description, 
    price, 
    originalPrice, 
    badge, 
    buttonText = "Personalise"
}) => {
    return (
        <div className="book-card bg-white rounded-lg p-4 border border-pink-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full relative group">
            {badge && (
                <div className="absolute top-6 left-6 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-black px-3 py-1.5 rounded-md shadow-[0_5px_15px_rgba(239,68,68,0.4)] transform -rotate-3 overflow-hidden">
                    {badge}
                </div>
            )}
            
            <div className="aspect-square rounded-none rounded-tr-3xl rounded-br-3xl overflow-hidden mb-6 relative">
                <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out" />
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
