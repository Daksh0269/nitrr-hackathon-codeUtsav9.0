// File: src/LayoutUI/courseUI/CourseCard.jsx

import React from 'react';
import { Star, Laptop, User } from 'lucide-react'; 
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import GridPageWrapper from '../ClubsUI/GridWrapper';
/**
 * Rating Badge (inspired by "JOB READY" tag)
 * Positioned top-right, small text
 */
const RatingBadge = ({ rating }) => {
    const safeRating = parseFloat(rating || 0).toFixed(1);

    return (
        <div className="absolute top-2.5 right-2.5 z-10 
                        flex items-center space-x-1 
                        bg-black/60 backdrop-blur-sm 
                        border border-[#333333] 
                        rounded-full px-2 py-0.5 text-xs font-medium text-white">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{safeRating}</span>
        </div>
    );
};

/**
 * Instructor Tag (inspired by "HINGLISH" tag)
 */
const InstructorTag = ({ name }) => (
    <div className="flex items-center space-x-1 
                    bg-gray-700/50 text-gray-300 
                    rounded px-2 py-0.5 text-xs font-medium w-fit">
        <User className="w-3 h-3" />
        <span>{name}</span>
    </div>
);


/**
 * A COMPACT Card component matching the Sheryians layout to fit in a grid.
 */
function CourseCard({ id, title, provider, rating, description, onReview }) {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/courses/${id}`); 
    };

    return (
        // Card Body: h-full and flex-col are crucial for the grid
        <div className="group bg-[#181818] rounded-xl border border-[#333333]
                    transition-all duration-300 
                    hover:border-blue-600/60
                    flex flex-col h-full overflow-hidden">

            {/* 1. Visual Header (16:9 aspect ratio is WIDE, not TALL) */}
            <div className="relative w-full aspect-video bg-[#242424] 
                            flex items-center justify-center overflow-hidden">
                
                <Laptop className="w-1/2 h-1/2 text-gray-700 
                                 transition-transform duration-300 ease-in-out 
                                 group-hover:scale-110" 
                />
                
                <RatingBadge rating={parseFloat(rating) || 0} />
            </div>

            {/* 2. Content Area - COMPACT PADDING (p-3) */}
            {/* 'flex-grow' pushes the buttons to the bottom */}
            <div className="p-3 flex flex-col flex-grow">
                
                {/* Title - Smaller text (text-base) */}
                <h3 className="text-base font-bold text-white mb-2 leading-tight line-clamp-2">
                    {title}
                </h3>
                
             
                <div className="flex items-center space-x-2 mb-2">
                    <InstructorTag name={provider} />
                </div>
                
                {/* Description - Clamped to 2 lines, 'flex-grow' */}
                <p className="text-xs text-gray-400 flex-grow mb-3 line-clamp-2">
                    {description}
                </p>
                
                {/* Divider Line (like in the reference) */}
                <hr className="border-t border-[#333333] mb-3" />

                {/* Action Buttons - 'mt-auto' pushes this block to the bottom */}
                <div className="mt-auto flex space-x-2">
                    <Button
                        onClick={handleViewDetails}
                        variant="darkOutline" 
                        size="sm"
                        className="flex-1"
                    >
                        View Details
                    </Button>
                    <Button
                        onClick={onReview}
                        variant="default"
                        size="sm"
                        className="flex-1"
                    >
                        Write a Review
                    </Button>
                </div>
            </div>
        </div> 
       
    );
   
}

export default CourseCard;