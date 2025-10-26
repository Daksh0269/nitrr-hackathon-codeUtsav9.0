import React, { useState, useEffect } from 'react'
import GridPageWrapper from '../LayoutUI/ClubsUI/GridWrapper';
import CourseCard from '../LayoutUI/courseUI/CourseCard';
import Service from '../appwrite/config'; 
import { useNavigate } from 'react-router-dom';
import Button from '../LayoutUI/components/Button';

// Utility Function: Calculates the average rating for all courses
const calculateAverageRatings = (allReviews) => {
    const ratingMap = {};

    allReviews.forEach(review => {
        // NOTE: Uses attributes expected from the Appwrite reviews collection
        const courseId = review.courseId;
        const stars = parseFloat(review.stars); 

        if (courseId && !isNaN(stars)) {
            if (!ratingMap[courseId]) {
                ratingMap[courseId] = { sum: 0, count: 0 };
            }
            ratingMap[courseId].sum += stars;
            ratingMap[courseId].count += 1;
        }
    });

    const averageRatings = {};
    for (const id in ratingMap) {
        averageRatings[id] = {
            average: ratingMap[id].sum / ratingMap[id].count,
            count: ratingMap[id].count
        };
    }
    return averageRatings;
};

const CoursesAndReviews = () => { // Renamed to consistent component name
    const [courses, setCourses] = useState([]);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Effect 1: Fetch Courses (Main List)
    useEffect(() => {
        Service.getCourses()
            .then((data) => {
                if (data) {
                    setCourses(data);
                } else {
                    setCourses([]);
                }
            })
            .catch((err) => {
                setError("Failed to load courses from the server.");
            });
            // We do NOT set loading to false here, as we wait for reviews in the next effect
    }, []);

    // Effect 2: Fetch Reviews and Calculate Average
    useEffect(() => {
        // Only run if courses have been fetched
        if (courses.length > 0) {
            Service.getReviews()
                .then((response) => {
                    // Assuming response structure is { documents: [...] }
                    const allReviews = response.documents || [];
                    const calculatedRatings = calculateAverageRatings(allReviews);
                    setRatings(calculatedRatings);
                })
                .catch((err) => {
                    console.error("Failed to fetch reviews for rating calculation:", err);
                    // Continue without ratings if fetch fails
                })
                .finally(() => {
                    // Set loading to false once both fetches are complete
                    setLoading(false); 
                });
        } 
        // Handle case where there are no courses to begin with (no need to fetch reviews)
        else if (courses.length === 0 && !loading) {
             setLoading(false);
        }
    }, [courses]); // Dependency on the courses array

    const handleWriteReview = (id) => {
        navigate(`/submit-review?courseId=${id}`); 
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white p-8">
                <p className="text-xl text-blue-500">Loading courses and average ratings...</p>
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
    
    // MAPPING: Get the calculated average rating
    const transformedCourses = courses.map(course => {
        const courseId = course.$id;
        const courseRatingData = ratings[courseId];
        
        return {
            id: courseId, 
            title: course.title || "Untitled Course",
            instructor: course.instructor || "Unknown Instructor",
            // Pass the dynamically calculated average rating, default to 0
            rating: courseRatingData ? courseRatingData.average : 0, 
            description: course.description || "No description available.",
        };
    });


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
                        id={course.id}
                        title={course.title}
                        instructor={course.instructor}
                        rating={course.rating} // Now passing the calculated average rating
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