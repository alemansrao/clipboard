import mongoose, { Schema } from "mongoose";

// Define the schema for the users collection
const usersSchema = new Schema(
    {
        user_name: {
            type: String, required: true // User name is mandatory
        },
        email: {
            type: String, required: true // Email is mandatory
        },
        password: {
            type: String, required: true // Password is mandatory
        },
    },
    {
        timestamps: true // Automatically add createdAt and updatedAt fields
    }
);

// Create the Users model if it doesn't already exist, otherwise use the existing one
const Users = mongoose.models.User || mongoose.model("User", usersSchema);

export default Users;
