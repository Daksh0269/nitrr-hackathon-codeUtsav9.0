import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Note: You must ensure CourseDetail.jsx exists and has the code from the previous step.
import CourseDetail from '../LayoutUI/courseUI/CourseDetail';
import Service from '../appwrite/config'; 

function CourseDetailPage() {
    // CRITICAL: Ensure the name here matches the route parameter in main.jsx (:courseId)
    const { courseId } = useParams(); 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // ADDED LOG for debugging the exact ID value
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
    
    return <CourseDetail course={course} />;
}

export default CourseDetailPage;