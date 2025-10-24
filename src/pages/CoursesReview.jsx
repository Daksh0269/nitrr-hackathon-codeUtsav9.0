import React, { useState, useEffect } from 'react'
import GridPageWrapper from '../LayoutUI/ClubsUI/GridWrapper';
import CourseCard from '../LayoutUI/courseUI/CourseCard';
import Service from '../appwrite/config'; 
import { useNavigate } from 'react-router-dom';
import Button from '../LayoutUI/components/Button';
const CoursesAndReviews = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        // CRITICAL: Fetches data, including the Appwrite document $id
        Service.getCourses()
            .then((data) => {
                if (data && data.length > 0) {
                    setCourses(data);
                } else {
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

    const handleWriteReview = (id) => {
        navigate(`/submit-review?courseId=${id}`); 
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
    
    // CRITICAL: Maps the course.$id to the CourseCard 'id' prop
    const transformedCourses = courses.map(course => ({
        id: course.$id, // THIS IS WHERE THE ID IS SET
        title: course.title || "Untitled Course",
        instructor: course.instructor || "Unknown Instructor",
        rating: parseFloat(course.rating) || 0, 
        description: course.description || "No description available.",
    }));


    return (
        <GridPageWrapper minCardWidth={300}>
            <div className="col-span-full mb-4 flex justify-end">
                <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => navigate('/add-course')}
                >
                    + Add New Course
                </Button>
            </div>

            {transformedCourses.length > 0 ? (
                transformedCourses.map((course) => (
                    <CourseCard
                        key={course.id}
                        id={course.id} // The ID is passed here
                        title={course.title}
                        instructor={course.instructor}
                        rating={course.rating}
                        description={course.description}
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