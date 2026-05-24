import React, { useRef, useLayoutEffect } from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ReviewCard from './ReviewCard'; 

const RatingStars = ({ rating }) => {
    const safeRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(safeRating);
    const emptyStars = 5 - fullStars;

    return (
        <div className="flex items-center space-x-1 bg-black/30 px-4 py-2 rounded-lg border border-white/5">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            ))}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-5 h-5 text-white/20" />
            ))}
             <span className="ml-3 text-lg font-bold text-white tracking-wide">
                {safeRating.toFixed(1)} <span className="text-gray-500 text-sm font-medium">/ 5</span>
             </span>
        </div>
    );
};

function CourseDetail({ course, reviews, loadingReviews, averageRating }) {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    
    const handleWriteReview = () => {
        navigate(`/submit-review?courseId=${course.$id}`);
    };

    // GSAP Animations
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();
            
            // Animate main blocks
            tl.fromTo('.reveal-section', 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
            );

            // Animate reviews if they exist and are done loading
            if (!loadingReviews && reviews?.length > 0) {
                gsap.fromTo('.review-item', 
                    { x: -20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.4 }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, [loadingReviews, reviews]);

    return (
        <div ref={containerRef} className="bg-black min-h-screen py-24 relative overflow-hidden selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/courses')}
                    className="reveal-section flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors mb-8 group font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </button>

                {/* Header Section */}
                <div className="reveal-section bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 mb-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400" />
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                        <div>
                            <span className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-3 block">Course Details</span>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">{course.title}</h1>
                            <p className="text-lg text-gray-300 flex items-center gap-2">
                                <span className="text-gray-500">Instructor:</span>
                                <span className="text-blue-200 font-medium bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20">{course.provider}</span>
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-4 items-start md:items-end min-w-[200px]">
                            <RatingStars rating={averageRating} />
                            <button
                                onClick={handleWriteReview} 
                                className="w-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:-translate-y-1"
                            >
                                Write a Review
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description and Details */}
                <div className="reveal-section bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 mb-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full block"></span>
                        Course Overview
                    </h2>
                    <p className="text-base text-gray-300 whitespace-pre-wrap leading-relaxed">{course.description}</p>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
                        <p className="flex flex-col"><span className="text-gray-600 text-xs uppercase tracking-wider mb-1">Document ID</span> {course.$id}</p>
                        <p className="flex flex-col"><span className="text-gray-600 text-xs uppercase tracking-wider mb-1">Added On</span> {new Date(course.$createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reveal-section bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-cyan-500 rounded-full block"></span>
                            Student Reviews
                        </h2>
                        <span className="text-sm font-bold text-cyan-300 bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/20">
                            {reviews?.length || 0} Total
                        </span>
                    </div>
                    
                    {loadingReviews ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
                        </div>
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
                        <div className="text-center py-12 bg-black/20 rounded-xl border border-white/5 border-dashed">
                            <p className="text-gray-400 mb-4 font-medium">No reviews yet. Help out your peers by sharing your experience!</p>
                             <button 
                                 className="text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 px-6 rounded-lg transition-colors"
                                 onClick={handleWriteReview}
                            >
                                Be the first to review
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default CourseDetail;