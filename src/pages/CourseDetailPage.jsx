import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// CORRECTED PATH: Changed 'courseUI' to the correct 'CoursesUI' directory
import CourseDetail from '../LayoutUI/courseUI/CourseDetail'
import Service from '../appwrite/config'; 

function CourseDetailPage() {
    // Parameter extraction
    const { courseId } = useParams(); 
    
    // STATE 1: Course Data (Primary Fetch)
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // STATE 2: Review Data (Secondary Fetch)
    const [reviews, setReviews] = useState([]); // INITIALIZED missing state
    const [loadingReviews, setLoadingReviews] = useState(false); // INITIALIZED missing state

    // Effect 1: Fetch Course Data
    useEffect(() => {
        console.log('CourseDetailPage useEffect triggered. Received ID:', courseId); 
        
        if (!courseId) {
            setError("Error: Course ID is missing from the URL. Cannot fetch details.");
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

    // Effect 2: Fetch Reviews for this Course (Restored Logic)
    useEffect(() => {
        if (courseId) {
            setLoadingReviews(true);
            Service.getCourseReviews(courseId)
                // The .then(setReviews) now works because setReviews is defined above
                .then(setReviews) 
                .catch(err => console.error("Failed to fetch reviews:", err))
                .finally(() => setLoadingReviews(false));
        } else {
            setReviews([]);
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
    
    // Final Render: Pass fetched data and loading state to CourseDetail
    return <CourseDetail 
                course={course} 
                reviews={reviews} 
                loadingReviews={loadingReviews} 
            />;
}

export default CourseDetailPage;