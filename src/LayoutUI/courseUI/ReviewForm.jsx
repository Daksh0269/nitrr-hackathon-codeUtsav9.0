import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Service from '../../appwrite/config'; 

// Placeholder star selector - implement a more visual one later
const StarRatingInput = React.forwardRef(({ value, onChange }, ref) => (
    <div className="flex items-center space-x-2">
        <label className="text-gray-400 font-medium">Rating (1-5):</label>
        <select 
            className="bg-black border border-[#333333] rounded-lg px-3 py-2 text-white focus:ring-blue-600 focus:border-blue-600"
            value={value} 
            onChange={onChange} 
            ref={ref}
            required
        >
            <option value="">Select Stars</option>
            {[1, 2, 3, 4, 5].map(star => (
                <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
            ))}
        </select>
    </div>
));

StarRatingInput.displayName = "StarRatingInput";


function ReviewForm({ courseId = 'default_course_id' }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Get logged-in user data for submission
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);

    if (!authStatus || !userData) {
        return (
            <div className="text-center p-8 text-white">
                <p>Please <Button onClick={() => navigate('/login')} size="sm" variant="link">log in</Button> to submit a review.</p>
            </div>
        );
    }
    
    const submitReview = async (data) => {
        setError(null);
        setLoading(true);
        try {
            const reviewData = {
                content: data.content,
                stars: parseInt(data.stars), // Ensure stars is an integer
                userId: userData.$id,
                username: userData.name,
                // In a final setup, you'd add the actual courseId/slug here:
                // courseId: courseId, 
                // Note: Your current createReview doesn't take courseId, adjust Appwrite schema if needed.
            };
            
            const review = await Service.createReview(reviewData);

            if (review) {
                // Navigate to the user's reviews or the course page
                navigate('/your-reviews'); 
            } else {
                setError("Review submission failed.");
            }
        } catch (err) {
            console.error("Review submission error:", err);
            setError(err.message || "An unexpected error occurred during submission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center min-h-screen bg-black py-12">
            <div className="bg-[#181818] p-8 rounded-2xl border border-[#333333] shadow-2xl w-full max-w-lg">
                <h1 className="text-2xl font-bold text-white mb-4">Submit a Review</h1>
                <p className="text-gray-400 mb-6 text-sm">Course ID: {courseId}</p>

                {error && (
                    <div className="mb-4 text-red-400 text-sm text-center font-medium bg-red-900/30 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(submitReview)} className="space-y-4">
                    
                    <StarRatingInput 
                        {...register("stars", { required: "Rating is required" })}
                    />
                    {errors.stars && <p className="text-red-400 text-xs">{errors.stars.message}</p>}

                    <div>
                        <textarea
                            className="w-full bg-black border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 min-h-32"
                            placeholder="Write your detailed review here..."
                            {...register("content", { 
                                required: "Review content is required",
                                minLength: { value: 20, message: "Review must be at least 20 characters." }
                            })}
                        />
                        {errors.content && <p className="text-red-400 text-xs">{errors.content.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        loading={loading}
                        className="w-full mt-6"
                    >
                        {loading ? 'Submitting...' : 'Post Review'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default ReviewForm;