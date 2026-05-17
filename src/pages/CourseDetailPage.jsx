// File: src/pages/CourseDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseDetail from '../LayoutUI/courseUI/CourseDetail' // Ensure this path is correct
import Service from '../appwrite/config'; 

function CourseDetailPage() {
    const { courseId } = useParams();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0); 
    const [loadingReviews, setLoadingReviews] = useState(false); 

  
    useEffect(() => {
        if (!courseId) {
            setError("Error: Course ID is missing from the URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        Service.getCourse(courseId) 
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
    

    return <CourseDetail 
                course={course} 
                reviews={reviews} 
                averageRating={averageRating} 
                loadingReviews={loadingReviews} 
            />;
}

export default CourseDetailPage;