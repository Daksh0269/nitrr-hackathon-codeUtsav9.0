import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courses: [],
    coursesLoaded: false, // Flag to track if we already have the data
    currentCourse: null,
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        setCourses: (state, action) => {
            state.courses = action.payload;
            state.coursesLoaded = true; // Mark as loaded
        },
        addCourseToStore: (state, action) => {
            state.courses.push(action.payload);
        },
        setCurrentCourse: (state, action) => {
            state.currentCourse = action.payload;
        },
        updateCourseRatingInStore: (state, action) => {
            const { courseId, rating, totalReviews } = action.payload;
            const index = state.courses.findIndex(c => c.$id === courseId);
            if (index !== -1) {
                state.courses[index].rating = String(rating);
                if (totalReviews) state.courses[index].totalReviews = totalReviews;
            }
            if (state.currentCourse && state.currentCourse.$id === courseId) {
                state.currentCourse.rating = String(rating);
                if (totalReviews) state.currentCourse.totalReviews = totalReviews;
            }
        }
    }
});

export const { 
    setCourses, 
    addCourseToStore, 
    setCurrentCourse, 
    updateCourseRatingInStore 
} = coursesSlice.actions;

export default coursesSlice.reducer;