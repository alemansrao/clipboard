import mongoose from "mongoose";

let isConnected; // Track the connection state

const ConnectMongoDb = async () => {
	if (isConnected) {
		// If already connected, return
		console.log("Using existing MongoDB connection");
		return;
	}

	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGO_URI, {});
		isConnected = true; // Set connection state to true
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Error connecting to MongoDB", error);
		throw new Error("MongoDB connection failed");
	}
};

export default ConnectMongoDb;