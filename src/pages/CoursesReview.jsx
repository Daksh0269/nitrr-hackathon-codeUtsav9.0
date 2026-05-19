import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCourses } from '../features/coursesSlice';
import GridPageWrapper from '../LayoutUI/ClubsUI/GridWrapper';
import CourseCard from '../LayoutUI/courseUI/CourseCard';
import Service from '../appwrite/config'; 
import { useNavigate } from 'react-router-dom';

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
    const dispatch = useDispatch();
    // 1. Pull from Redux instead of local state
    const { courses, coursesLoaded } = useSelector((state) => state.courses);
    
    // 2. Only show loading screen if Redux hasn't loaded data yet
    const [loading, setLoading] = useState(!coursesLoaded);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 3. Skip API calls if we already have the cached data
        if (coursesLoaded) {
            setLoading(false);
            return;
        }

        setLoading(true);
        
        // 4. Optimize: Fetch both Courses and Reviews at the exact same time
        Promise.all([
            Service.getCourses(),
            Service.getReviews()
        ])
        .then(([fetchedCourses, fetchedReviewsResponse]) => {
            const allReviews = fetchedReviewsResponse?.documents || [];
            const calculatedRatings = calculateAverageRatings(allReviews);

            // 5. Merge the calculated ratings into the course data before caching
            const coursesWithRatings = (fetchedCourses || []).map(course => ({
                ...course,
                clientSideRating: calculatedRatings[course.$id] ? calculatedRatings[course.$id].average : 0
            }));

            // 6. Save the fully processed list to Redux
            dispatch(setCourses(coursesWithRatings));
        })
        .catch((err) => {
            console.error("Failed to fetch data:", err);
            setError("Failed to load courses from the server.");
        })
        .finally(() => {
            setLoading(false);
        });
    }, [coursesLoaded, dispatch]);

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

    return (
        <GridPageWrapper minCardWidth={300}>
            {courses.length > 0 ? (
                courses.map((course) => (
                    <CourseCard
                        key={course.$id}
                        id={course.$id}
                        title={course.title || "Untitled Course"}
                        provider={course.provider || "Unknown Instructor"}
                        rating={course.clientSideRating || course.rating || 0} // Read the cached rating
                        description={course.description || "No description available."}
                        onReview={() => handleWriteReview(course.$id)}
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