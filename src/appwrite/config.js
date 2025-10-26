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
                    courseId // <<< REQUIRED BY APPWRITE SCHEMA
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
                "reviews", // This is the Reviews Collection ID
                [
                    // CRITICAL: Filter where the 'courseId' attribute in the reviews collection equals the current course's ID
                    Query.equal('courseId', courseId),
                    Query.orderDesc('$createdAt'), // Order by most recent reviews
                ]
            );
            return reviews.documents; // Returns an array of review documents
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
}


const Service = new AppwriteService();

export default Service;