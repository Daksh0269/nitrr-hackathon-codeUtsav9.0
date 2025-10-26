import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class AppwriteService {
    client = new Client();
    Databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // Your Appwrite Endpoint
            .setProject(conf.appwriteProjectId); // Your Appwrite Project ID

        this.Databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }


   
    async createReview({ content, stars, userId, username, courseId }) {
        console.log({ content, stars, userId, username, courseId }); // Log the new data
        try {
            return this.Databases.createDocument(
                conf.appwriteDatabaseId,
                "reviews", // Used for Reviews
                ID.unique(),
                {
                    content,
                    stars,
                    userId,
                    username,
                    courseId 
                }
            );
        }
        catch (error) {
            console.error("Error creating post:", error);
        }
    }

    async updateReview(slug, { title, content, featuredImage, status }) {
        try {
            return await this.Databases.updateDocument(
                conf.appwriteDatabaseId,
                "reviews", // Used for Reviews
                ID.unique(),
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        }
        catch (error) {
            console.error("Error updating document:", error);
        }


    }
    async getReviews() {
        try {
            return await this.Databases.listDocuments(
                conf.appwriteDatabaseId,
                "reviews", // Used for Reviews

            );

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    // NEW: Create a new Course document
    async createCourse({ title, instructor, description, rating = 0 }) {
        try {
            return this.Databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCoursesCollectionId, // Target the Courses collection
                ID.unique(),
                {
                    title,
                    instructor,
                    description,
                    rating: String(rating),
                }
            );
        }
        catch (error) {
            console.error("Error creating course:", error);
            return null;
        }
    }
   async getCourseReviews(courseId) {
        try {
            const reviews = await this.Databases.listDocuments(
                conf.appwriteDatabaseId,
                "reviews",
                [
                    Query.equal('courseId', courseId), 
                    Query.orderDesc('$createdAt')
                ]
            );
            // Returning the documents array
            return reviews.documents || []; 
        } catch (error) {
            console.error("Error fetching course reviews:", error);
            return [];
        }
    }


    async getCourses() {
        try {
            const courses = await this.Databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCoursesCollectionId,
            );
            return courses.documents;
        } catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        }
    }

    // NEW: Fetches a single Course document by ID (used on /courses/:courseId)
    async getCourse(courseId) {
        try {
            return await this.Databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCoursesCollectionId,
                courseId
            );
        } catch (error) {
            console.error("Error fetching single course:", error);
            return null;
        }
    }
    async updateCourseRating(courseId) {
        try {
            // 1. Fetch ALL reviews for this course
            const reviews = await this.getCourseReviews(courseId);

            let newAvgRating = 0;
            
            if (reviews && reviews.length > 0) {
                const totalStars = reviews.reduce((sum, review) => sum + (review.stars || 0), 0);
                // Calculate average and round to 1 decimal point
                newAvgRating = parseFloat((totalStars / reviews.length).toFixed(1)); 
            }
            
            // 2. Update the Course Document with the correct column name 'rating'
            await this.Databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCoursesCollectionId, // Your Courses Collection ID
                courseId,
                {
                    // 🚨 USE THE COLUMN NAME FROM YOUR SCHEMA IMAGE
                    rating: newAvgRating,
                    totalReviews: reviews.length // Optional, but good practice
                }
            );
            console.log(`Updated rating for course ${courseId}: ${newAvgRating} stars across ${reviews.length} reviews.`);
        } catch (error) {
            console.error(`Failed to update rating for course ${courseId}:`, error);
        }
    }
}


const Service = new AppwriteService();

export default Service;