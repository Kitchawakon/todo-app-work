import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (!uri) throw new Error("MongoDB URI is not defined");
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
