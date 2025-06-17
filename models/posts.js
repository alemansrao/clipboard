// Define the schema for posts

import mongoose, { Schema } from "mongoose";

const postsSchema = new Schema(
    {
        // Unique identifier for the post
        // _id will be used for post_id in the collection

		// Unique identifier for the post, Auto increment from  1, sequesnce from 1
		post_id: { type: String, unique: true, required: true },

		// Title of the post
		// post_title: { type: String, required: true },

		// Content of the post
		post_content: { type: String, required: true },

		//favorite status of the post
		favorite: { type: Boolean, default: false },

		//User who created the post
		user_id: { type: String, required: true },
    },
    {
        // Automatically add `createdAt` and `updatedAt` timestamps
        timestamps: true
    }
);

// Create the Posts model if it doesn't already exist
const Posts = mongoose.models.Post || mongoose.model("Post", postsSchema);

// Export the Posts model for use in other parts of the application
export default Posts;
