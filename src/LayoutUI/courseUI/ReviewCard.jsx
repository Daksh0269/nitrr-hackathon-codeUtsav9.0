import React from 'react';
import { Star } from 'lucide-react'; 

// Simple component for displaying star rating on the review card
const ReviewStars = ({ stars }) => {
    const safeRating = Math.max(0, Math.min(5, stars));
    const fullStars = Math.floor(safeRating);
    const emptyStars = 5 - fullStars;

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            ))}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-3 h-3 text-gray-600" />
            ))}
        </div>
    );
};

const ReviewCard = ({ username, content, stars, createdAt }) => (
    <div className="border-b border-[#333333] pb-4 mb-4 last:border-b-0">
        <div className="flex items-center justify-between mb-1">
            <p className="text-white font-semibold">{username || "Anonymous"}</p>
            <ReviewStars stars={stars} />
        </div>
        <p className="text-gray-400 text-sm whitespace-pre-wrap">{content}</p>
        <p className="text-xs text-gray-600 mt-2">
            Reviewed on: {new Date(createdAt).toLocaleDateString()}
        </p>
    </div>
);

export default ReviewCard;