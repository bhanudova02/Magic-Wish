import React from 'react';

const SkeletonCard = () => (
    <div className="bg-white rounded-sm p-4 md:p-6 flex flex-col h-full animate-pulse border-2 border-gray-300 shadow-sm">
        <div className="w-full aspect-square bg-gray-100 rounded-sm mb-6"></div>
        <div className="h-6 bg-gray-100 rounded-sm w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-100 rounded-sm w-1/2 mb-6"></div>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
            <div className="h-6 bg-gray-100 rounded-sm w-1/4"></div>
            <div className="h-8 w-8 bg-gray-100 rounded-sm"></div>
        </div>
    </div>
);

export default SkeletonCard;
