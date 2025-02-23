import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongodbUri = process.env.MONGODB_URI as string;
    const conn = await mongoose.connect(mongodbUri)
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};
