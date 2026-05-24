import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCourses } from '../features/coursesSlice';
import Service from '../appwrite/config'; 
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const calculateAverageRatings = (allReviews) => {
    const ratingMap = {};
    allReviews.forEach(review => {
        const courseId = review.courseId;
        const stars = parseFloat(review.stars); 
        if (courseId && !isNaN(stars)) {
            if (!ratingMap[courseId]) ratingMap[courseId] = { sum: 0, count: 0 };
            ratingMap[courseId].sum += stars;
            ratingMap[courseId].count += 1;
        }
    });
    const averageRatings = {};
    for (const id in ratingMap) {
        averageRatings[id] = { average: ratingMap[id].sum / ratingMap[id].count, count: ratingMap[id].count };
    }
    return averageRatings;
};

const CoursesAndReviews = () => {
    const dispatch = useDispatch();
    const { courses, coursesLoaded } = useSelector((state) => state.courses);
    const [loading, setLoading] = useState(!coursesLoaded);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // 1. Redux & Appwrite Data Fetching
    useEffect(() => {
        if (coursesLoaded) { setLoading(false); return; }
        setLoading(true);
        Promise.all([Service.getCourses(), Service.getReviews()])
            .then(([fetchedCourses, fetchedReviewsResponse]) => {
                const allReviews = fetchedReviewsResponse?.documents || [];
                const calculatedRatings = calculateAverageRatings(allReviews);
                const coursesWithRatings = (fetchedCourses || []).map(course => ({
                    ...course,
                    clientSideRating: calculatedRatings[course.$id] ? calculatedRatings[course.$id].average : 0
                }));
                dispatch(setCourses(coursesWithRatings));
            })
            .catch((err) => setError("Failed to load courses from the server."))
            .finally(() => setLoading(false));
    }, [coursesLoaded, dispatch]);

    // 2. GSAP Animations (Runs only when loading is complete)
    useLayoutEffect(() => {
        if (loading || error) return;
        let ctx = gsap.context(() => {
            gsap.fromTo('.reveal-header', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
            gsap.fromTo('.course-card', 
                { y: 40, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading, error, courses]);

    // Render Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-blue-400 font-medium tracking-widest text-sm uppercase animate-pulse">Loading Courses...</p>
            </div>
        );
    }

    // Render Error State
    if (error) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl text-center">
                    <p className="text-xl text-red-400 font-bold mb-2">Oops!</p>
                    <p className="text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    // Render Main UI
    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white pt-24 pb-20 px-6 overflow-hidden">
            <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="reveal-header mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-sm font-bold text-blue-400 tracking-widest mb-2 uppercase">Academics</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Course Reviews.</h1>
                    </div>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg font-medium text-sm shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                        Suggest a Course
                    </button>
                </div>

                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => {
                            const rating = course.clientSideRating || course.rating || 0;
                            return (
                                <div key={course.$id} onClick={() => navigate(`/courses/${course.$id}`)} className="course-card bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col h-full group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-gray-300 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                            {course.provider || "Unknown"}
                                        </span>
                                        <div className="flex items-center gap-1 bg-blue-900/30 px-2 py-1 rounded border border-blue-500/20">
                                            <span className="text-yellow-400 text-sm">★</span>
                                            <span className="text-sm font-bold text-blue-300">{Number(rating).toFixed(1)}</span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{course.title || "Untitled Course"}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {course.description || "No description available."}
                                    </p>
                                    
                                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/submit-review?courseId=${course.$id}`); }} 
                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            Write Review
                                        </button>
                                        <span className="text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">Read →</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="reveal-header text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-2xl font-bold mb-2">No Courses Found</p>
                        <p className="text-gray-400">The courses database is currently empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoursesAndReviews;