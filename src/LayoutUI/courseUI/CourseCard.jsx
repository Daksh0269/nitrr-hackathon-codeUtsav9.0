import React from 'react';
import { Star } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import CourseDetail from './CourseDetail';
import ReviewForm from './ReviewForm';

/**
 * Renders a read-only star rating.
 * @param {number} rating - The score from 0 to 5.
 */
const RatingStars = ({ rating }) => {
    // Clamp rating between 0 and 5
    const safeRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = (safeRating % 1) >= 0.5; // Changed to check for half star
    const starsToRender = Math.ceil(safeRating);
    const emptyStars = 5 - starsToRender;

    return (
        <div className="flex items-center space-x-0.5">
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            ))}
            {/* Half Star */}
            {hasHalfStar && (
                <Star key="half" className="w-4 h-4 text-yellow-500 fill-current opacity-50" />
            )}
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
 */
function CourseCard({ id, title, instructor, rating, description, onView, onReview }) {
    const navigate = useNavigate(); // ADDED

    const handleViewDetails = () => {
        // Navigate to the dynamic course detail page
        navigate(`/courses/${id}`);
    };
    
    // ... (rest of the component structure)

    return (
        <div className="bg-[#181818] rounded-xl border border-[#333333] p-5 
                    transition-all duration-300 hover:shadow-xl hover:border-blue-600 
                    flex flex-col h-full">
            
            {/* ... (omitted content) */}
            
            {/* Action Buttons */}
            <div className="mt-auto pt-3 flex space-x-3">
                <Button
                    onClick={handleViewDetails} // UPDATED handler
                    variant="default" 
                    size="sm"
                    className="flex-1"
                >
                    View Details
                </Button>
                <Button
                    onClick={onReview} 
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