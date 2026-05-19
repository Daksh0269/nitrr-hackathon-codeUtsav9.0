import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CourseDetail from '../LayoutUI/courseUI/CourseDetail';
import Service from '../appwrite/config'; 

function CourseDetailPage() {
    const { courseId } = useParams();
    
    // 1. Get the cached courses array from Redux
    const { courses } = useSelector((state) => state.courses);
    
    // 2. See if we already have this specific course in our cache
    const cachedCourse = courses.find(c => c.$id === courseId);

    // 3. Initialize state using the cached course if it exists
    const [course, setCourse] = useState(cachedCourse || null);
    const [loading, setLoading] = useState(!cachedCourse); // Skip loading if we have the cache
    const [error, setError] = useState(null);
    
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0); 
    const [loadingReviews, setLoadingReviews] = useState(false); 

    // Effect for handling the Course Data
    useEffect(() => {
        if (!courseId) {
            setError("Error: Course ID is missing from the URL.");
            setLoading(false);
            return;
        }

        // If Redux already provided the course, skip the API call entirely
        if (cachedCourse) {
            setLoading(false);
            return;
        }

        // Fallback: Fetch from server if user navigates directly to the URL (cache is empty)
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
    }, [courseId, cachedCourse]);

    // Effect for handling the Reviews (Always fetch fresh reviews)
    useEffect(() => {
        if (courseId) {
            setLoadingReviews(true);
            Service.getCourseReviews(courseId) 
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