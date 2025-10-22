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

    async createReview({ content, stars, userId,username }) {
        console.log({ content, stars,  userId });
        try {
            return this.Databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
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
                conf.appwriteCollectionId,
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
                conf.appwriteCollectionId,
                
            );

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }
}


const Service = new AppwriteService();

export default Service