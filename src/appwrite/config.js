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
    
    // ... (Your existing methods: createPost, updateDocument, getPosts, etc.) ...

    // =========================================================================
    //                  ⭐ COURSE REVIEW/RATING FUNCTIONALITY ⭐
    // =========================================================================

    /**
     * @description Submits a new rating/review for a course.
     * @param {string} courseId - The ID of the course being reviewed.
     * @param {string} userId - The ID of the user submitting the review (Appwrite User ID).
     * @param {number} stars - The star rating (1-5).
     * @param {string} reviewText - The text review (optional).
     * @returns {Promise<object>} The newly created rating document.
     */
    async submitCourseRating({ courseId, userId, stars, reviewText = "" }) {
        try {
            // Basic validation for stars (server-side validation is still recommended)
            if (stars < 1 || stars > 5 || !Number.isInteger(stars)) {
                throw new Error("Star rating must be an integer between 1 and 5.");
            }

            // Check for duplicate review (User cannot review the same course twice)
            const existingRatings = await this.Databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteRatingsCollectionId,
                [
                    Query.equal('courseId', courseId),
                    Query.equal('userId', userId),
                    Query.limit(1) // Optimization: only need to find one
                ]
            );

            if (existingRatings.total > 0) {
                // Return null or throw a specific error to indicate a duplicate
                throw new Error("You have already submitted a review for this course. Please use the update method.");
            }
            
            // Create the new rating document
            const newRating = await this.Databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteRatingsCollectionId,
                ID.unique(), // Let Appwrite generate a unique ID for the rating
                {
                    courseId,
                    userId,
                    stars,
                    reviewText,
                    // Note: Appwrite automatically adds $createdAt, which serves as dateCreated
                }
            );

            // In a real-world scenario, you'd trigger a Cloud Function here to recalculate the average

            return newRating;

        } catch (error) {
            console.error("Error submitting course rating:", error);
            throw error;
        }
    }

    /**
     * @description Updates an existing user rating/review.
     * @param {string} ratingId - The ID of the rating document to update.
     * @param {object} data - Object containing fields to update (stars, reviewText).
     * @returns {Promise<object>} The updated rating document.
     */
    async updateCourseRating(ratingId, { stars, reviewText }) {
        try {
             // Basic validation for stars
             if (stars !== undefined && (stars < 1 || stars > 5 || !Number.isInteger(stars))) {
                throw new Error("Star rating must be an integer between 1 and 5.");
            }

            // Update the document
            const updatedRating = await this.Databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteRatingsCollectionId,
                ratingId,
                {
                    // Only include defined fields to allow partial updates
                    ...(stars !== undefined && { stars }),
                    ...(reviewText !== undefined && { reviewText })
                }
            );
            
            // In a real-world scenario, you'd trigger a Cloud Function here to recalculate the average

            return updatedRating;

        } catch (error) {
            console.error("Error updating course rating:", error);
            throw error;
        }
    }

    /**
     * @description Deletes a rating/review.
     * @param {string} ratingId - The ID of the rating document to delete.
     * @returns {Promise<boolean>} True on success.
     */
    async deleteCourseRating(ratingId) {
        try {
            await this.Databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteRatingsCollectionId,
                ratingId
            );

            // In a real-world scenario, you'd trigger a Cloud Function here to recalculate the average

            return true;
        } catch (error) {
            console.error("Error deleting course rating:", error);
            return false;
        }
    }
    
    /**
     * @description Fetches all ratings for a specific course.
     * @param {string} courseId - The ID of the course.
     * @param {Array<Query>} queries - Optional Appwrite Query array for filtering/sorting (e.g., Query.orderDesc('$createdAt')).
     * @returns {Promise<object>} A list of rating documents.
     */
    async getCourseRatings(courseId, queries = []) {
        try {
            return await this.Databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteRatingsCollectionId,
                [
                    Query.equal('courseId', courseId),
                    ...queries
                ]
            );
        } catch (error) {
            console.error("Error fetching course ratings:", error);
            return { documents: [], total: 0 };
        }
    }

    /**
     * @description Fetches the rating a specific user gave to a specific course.
     * @param {string} courseId - The ID of the course.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<object|null>} The rating document or null if not found.
     */
    async getUserCourseRating(courseId, userId) {
        try {
            const result = await this.Databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteRatingsCollectionId,
                [
                    Query.equal('courseId', courseId),
                    Query.equal('userId', userId),
                    Query.limit(1)
                ]
            );
            return result.documents.length > 0 ? result.documents[0] : null;
        } catch (error) {
            console.error("Error fetching user course rating:", error);
            return null;
        }
    }

    /**
     * @description Updates a course document with new average rating/total counts (intended to be called by a Cloud Function trigger).
     * @param {string} courseId - The ID of the course document.
     * @param {number} averageRating - The newly calculated average star rating.
     * @param {number} totalRatings - The total number of ratings.
     * @returns {Promise<object>} The updated course document.
     */
    async updateCourseStats(courseId, { averageRating, totalRatings }) {
        try {
            return await this.Databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCoursesCollectionId,
                courseId,
                {
                    averageRating,
                    totalRatings,
                }
            );
        } catch (error) {
            console.error("Error updating course stats:", error);
            throw error;
        }
    }

    // ... (Your other methods) ...
}


const Service = new AppwriteService();

export default Service;