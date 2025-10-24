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
    async createReview({ content, stars, userId, username }) {
        console.log({ content, stars, userId });
        try {
            return this.Databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId, // Used for Reviews
                ID.unique(),
                {
                    content,
                    stars,
                    userId,
                    username
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
                conf.appwriteCollectionId, // Used for Reviews
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
                conf.appwriteCollectionId, // Used for Reviews

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

    // NEW: Fetches all documents from the dedicated Courses Collection (used on /courses)
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
}


const Service = new AppwriteService();

export default Service;