import React from 'react';
import { Star } from 'lucide-react'; 

// Upgraded star rating with subtle glow effects
const ReviewStars = ({ stars }) => {
    const safeRating = Math.max(0, Math.min(5, stars));
    const fullStars = Math.floor(safeRating);
    const emptyStars = 5 - fullStars;

    return (
        <div className="flex items-center space-x-1">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
            ))}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-4 h-4 text-white/20" />
            ))}
        </div>
    );
};

const ReviewCard = ({ username, content, stars, createdAt }) => (
    <div className="review-item bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
                {/* Auto-generated Avatar based on username */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                    {username ? username.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                    <p className="text-white font-semibold text-sm">{username || "Anonymous Student"}</p>
                    <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
            </div>
            <ReviewStars stars={stars} />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap pl-1">{content}</p>
    </div>
);

export default ReviewCard;