import React, { useState, useEffect } from 'react'
import GridPageWrapper from '../LayoutUI/ClubsUI/GridWrapper';
import Service from '../appwrite/config'; // Import Appwrite Service
import CourseCard from '../LayoutUI/courseUI/CourseCard'

const CoursesAndReviews = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        Service.getCourses()
            .then((data) => {
                if (data && data.length > 0) {
                    setCourses(data);
                } else {
                    // Fallback or empty state if database is empty
                    setCourses([]);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch courses:", err);
                setError("Failed to load courses from the server. Check Appwrite config.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleViewDetails = (title) => {
        console.log(`Navigating to details for: ${title}`);
    };

    const handleWriteReview = (id) => {
        console.log(`Opening review form for course ID: ${id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white p-8">
                <p className="text-xl text-blue-500">Loading courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white p-8">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }
    
    // Map Appwrite documents to expected CourseCard props
    const transformedCourses = courses.map(course => ({
        id: course.$id, // Use Appwrite's unique document ID
        title: course.title || "Untitled Course",
        instructor: course.instructor || "Unknown Instructor",
        rating: parseFloat(course.rating) || 0, 
        description: course.description || "No description available.",
        // Assumes your Appwrite documents have attributes 'title', 'instructor', 'rating', 'description'
    }));


    return (
        <GridPageWrapper minCardWidth={300}>
            {transformedCourses.length > 0 ? (
                transformedCourses.map((course) => (
                    <CourseCard
                        key={course.id}
                        title={course.title}
                        instructor={course.instructor}
                        rating={course.rating}
                        description={course.description}
                        onView={() => handleViewDetails(course.title)}
                        onReview={() => handleWriteReview(course.id)}
                    />
                ))
            ) : (
                <div className="text-white text-center col-span-full pt-10">
                    <p className="text-2xl font-bold mb-2">No Courses Found</p>
                    <p className="text-gray-400">The courses database is currently empty.</p>
                </div>
            )}
        </GridPageWrapper>
    );
}

export default CoursesAndReviews;