import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseDetail from '../LayoutUI/courseUI/CourseDetail';
import Service from '../appwrite/config'; 

function CourseDetailPage() {
    const { courseId } = useParams(); // Get the dynamic part of the URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) {
            setError("No Course ID provided in the URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        Service.getCourse(courseId)
            .then((data) => {
                if (data) {
                    setCourse(data);
                } else {
                    setError("Course not found or failed to fetch.");
                }
            })
            .catch((err) => {
                console.error("Error fetching course details:", err);
                setError("An error occurred while fetching course data.");
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
    
    // Pass the fetched course data to the detail component
    return <CourseDetail course={course} />;
}

export default CourseDetailPage;