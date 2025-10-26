// File: src/pages/CourseDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseDetail from '../LayoutUI/courseUI/CourseDetail' // Ensure this path is correct
import Service from '../appwrite/config'; 

function CourseDetailPage() {
    // Parameter extraction
    const { courseId } = useParams();
    
    // STATE 1: Course Data (Primary Fetch)
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // STATE 2: Review Data (Secondary Fetch)
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0); 
    const [loadingReviews, setLoadingReviews] = useState(false); 

    // Effect 1: Fetch Course Data
    useEffect(() => {
        if (!courseId) {
            setError("Error: Course ID is missing from the URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        Service.getCourse(courseId) // Fetches course document (which contains the aggregated 'rating' used by the Card)
            .then((data) => {
                if (data) {
                    setCourse(data);
                } else {
                    setError(`Course with ID "${courseId}" not found.`);
                }
            })
            .catch((err) => {
                console.error("Error fetching course details:", err);
                setError("An unexpected error occurred while fetching course data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [courseId]);

    // Effect 2: Fetch Reviews for this Course and Calculate Real-Time Rating (for the details page)
    useEffect(() => {
        if (courseId) {
            setLoadingReviews(true);
            Service.getCourseReviews(courseId) // Fetches all individual reviews
                .then((fetchedReviews) => {
                    setReviews(fetchedReviews);
                    
                    if (fetchedReviews && fetchedReviews.length > 0) {
                        const totalStars = fetchedReviews.reduce((sum, review) => sum + (review.stars || 0), 0);
                        const avg = totalStars / fetchedReviews.length;
                        setAverageRating(parseFloat(avg.toFixed(1))); 
                    } else {
                        setAverageRating(0); 
                    }
                }) 
                .catch(err => console.error("Failed to fetch reviews:", err))
                .finally(() => setLoadingReviews(false));
        } else {
            setReviews([]);
            setAverageRating(0);
            setLoadingReviews(false);
        }
    }, [courseId]);
    
    // Loading/Error UI checks
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white p-8">
                <p className="text-xl text-blue-500">Loading course details...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white p-8">
                <p className="text-2xl text-red-500">{error || "Course data is missing."}</p>
            </div>
        );
    }
    
    // Final Render: Pass fetched data and calculated rating
    return <CourseDetail 
                course={course} 
                reviews={reviews} 
                averageRating={averageRating} // Pass the calculated rating
                loadingReviews={loadingReviews} 
            />;
}

export default CourseDetailPage;