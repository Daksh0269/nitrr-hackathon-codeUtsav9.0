import React from 'react';
import { Star } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import ReviewCard from './ReviewCard'; // Assumed component for single review display

const RatingStars = ({ rating }) => {
    const safeRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(safeRating);
    // ⭐️ FIX: Calculate empty stars as the difference between 5 and fullStars, NOT Math.ceil(safeRating).
    const emptyStars = 5 - fullStars; //

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            ))}
            {[...Array(emptyStars)].map((_, i) => (
                // If rating is 5, fullStars is 5, emptyStars is 0.
                // If rating is 4, fullStars is 4, emptyStars is 1. (Renders 4 full, 1 empty)
                <Star key={`empty-${i}`} className="w-5 h-5 text-gray-600" />
            ))}
             <span className="ml-3 text-lg font-semibold text-white">
                {safeRating.toFixed(1)} / 5
             </span>
        </div>
    );
};


/**
 * Displays the full details of a single course, now with dynamic review data.
 * @param {Object} props.course - The fetched course document.
 * @param {Array} props.reviews - The fetched list of reviews for this course.
 * @param {boolean} props.loadingReviews - Loading state for reviews.
 */
function CourseDetail({ course, reviews, loadingReviews, averageRating }) {
    const navigate = useNavigate();
    
    // Handles the "Write a Review" button click
    const handleWriteReview = () => {
        // Navigates using the course's ID
        navigate(`/submit-review?courseId=${course.$id}`);
    };

    return (
        <div className="bg-black min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="bg-[#181818] rounded-xl border border-[#333333] p-8 mb-8">
                    <h1 className="text-4xl font-extrabold text-white mb-2">{course.title}</h1>
                    
                    <p className="text-xl text-blue-400 mb-6">
                        <span className="text-gray-500">Instructor: </span>
                        {course.instructor}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Rating here uses the static rating stored on the course document, 
                            which is fine for new courses. We rely on the review count below. */}
                        <RatingStars rating={averageRating} />
                        
                        <Button
                            onClick={handleWriteReview} 
                            variant="default" 
                            size="lg"
                        >
                            Write a Review
                        </Button>
                    </div>
                </div>

                {/* Description and Details */}
                <div className="bg-[#181818] rounded-xl border border-[#333333] p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#333333] pb-2">Course Overview</h2>
                    <p className="text-base text-gray-300 whitespace-pre-wrap">{course.description}</p>
                    
                    <div className="mt-6 pt-4 border-t border-[#333333] text-sm text-gray-400">
                        <p>Document ID: {course.$id}</p>
                        <p>Created: {new Date(course.$createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Reviews Section: Now Dynamic */}
                <div className="bg-[#181818] rounded-xl border border-[#333333] p-8">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#333333] pb-2">
                        User Reviews ({reviews?.length || 0})
                    </h2>
                    
                    {loadingReviews ? (
                        <p className="text-blue-400 text-center py-4">Loading user reviews...</p>
                    ) : reviews && reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <ReviewCard
                                    key={review.$id}
                                    username={review.username}
                                    content={review.content} 
                                    stars={review.stars}
                                    createdAt={review.$createdAt}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-400">No reviews yet. Be the first!</p>
                             <Button 
                                 variant="darkOutline" 
                                 size="sm" 
                                 className="mt-4"
                                 onClick={handleWriteReview}
                            >
                                Write a Review
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default CourseDetail;