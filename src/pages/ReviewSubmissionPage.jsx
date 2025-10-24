import React from 'react'
import ReviewForm from '../LayoutUI/courseUI/ReviewForm'

const ReviewSubmissionPage = () => {
    // You can use useParams() here to get the course ID if you had a dynamic route like /courses/:courseId/review
    return <ReviewForm courseId="Placeholder_Course_Title" />
}

export default ReviewSubmissionPage