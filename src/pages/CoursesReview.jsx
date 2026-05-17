import React, { useState, useEffect } from 'react'
import GridPageWrapper from '../LayoutUI/ClubsUI/GridWrapper';
import CourseCard from '../LayoutUI/courseUI/CourseCard';
import Service from '../appwrite/config'; 
import { useNavigate } from 'react-router-dom';
import Button from '../LayoutUI/components/Button';


const calculateAverageRatings = (allReviews) => {
    const ratingMap = {};

    allReviews.forEach(review => {
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

const CoursesAndReviews = () => {
    const [courses, setCourses] = useState([]);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


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
      
    }, []);

    
    useEffect(() => {
      
        if (courses.length > 0) {
            Service.getReviews()
                .then((response) => {
           
                    const allReviews = response.documents || [];
                    const calculatedRatings = calculateAverageRatings(allReviews);
                    setRatings(calculatedRatings);
                })
                .catch((err) => {
                    console.error("Failed to fetch reviews for rating calculation:", err);
                 
                })
                .finally(() => {
                
                    setLoading(false); 
                });
        } 
   
        else if (courses.length === 0 && !loading) {
             setLoading(false);
        }
    }, [courses]);

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
    
    
    const transformedCourses = courses.map(course => {
        const courseId = course.$id;
        const courseRatingData = ratings[courseId];
        
        return {
            id: courseId, 
            title: course.title || "Untitled Course",
            provider: course.provider || "Unknown Instructor",
            rating: courseRatingData ? courseRatingData.average : 0, 
            description: course.description || "No description available.",
        };
    });


    return (
        <GridPageWrapper minCardWidth={300}>
           
            {transformedCourses.length > 0 ? (
                transformedCourses.map((course) => (
                    <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        provider={course.provider}
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