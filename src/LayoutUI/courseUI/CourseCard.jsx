import React from 'react';
import { Star } from 'lucide-react'; 
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

/**
 * Renders a read-only star rating. (Re-used for visual consistency)
 * @param {number} rating - The score from 0 to 5.
 */
const RatingStars = ({ rating }) => {
    const safeRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(safeRating);
    const emptyStars = 5 - Math.ceil(safeRating);

    return (
        <div className="flex items-center space-x-0.5">
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            ))}
            {/* Empty Stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />
            ))}
             <span className="ml-2 text-xs text-gray-400">({safeRating.toFixed(1)})</span>
        </div>
    );
};


/**
 * A Card component tailored for courses and reviews.
 * The 'View Details' button navigates to the dynamic route /courses/:id.
 */
function CourseCard({ id, title, instructor, rating, description, onReview }) {
    // ^^^ 'id' is now correctly destructured and available ^^^
    const navigate = useNavigate();

    const handleViewDetails = () => {
        // Line 41: 'id' is now correctly referenced
        navigate(`/courses/${id}`); 
    };

    return (
        <div className="bg-[#181818] rounded-xl border border-[#333333] p-5 
                    transition-all duration-300 hover:shadow-xl hover:border-blue-600 
                    flex flex-col h-full">

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-1 leading-tight">{title}</h3>
            
            {/* Instructor / Platform */}
            <p className="text-sm text-blue-400 mb-3">
                <span className="text-gray-500">Instructor: </span>
                {instructor}
            </p>

            {/* Rating */}
            <div className="mb-4">
                <RatingStars rating={parseFloat(rating) || 0} /> 
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 flex-grow mb-4">{description}</p>
            
            {/* Action Buttons */}
            <div className="mt-auto pt-3 flex space-x-3">
                <Button
                    onClick={handleViewDetails} // Triggers navigation to the detail page
                    variant="default" 
                    size="sm"
                    className="flex-1"
                >
                    View Details
                </Button>
                <Button
                    onClick={onReview} // Expects a handler from the parent component
                    variant="darkOutline" 
                    size="sm"
                    className="flex-1"
                >
                    Write a Review
                </Button>
            </div>
        </div>
    );
}

export default CourseCard;