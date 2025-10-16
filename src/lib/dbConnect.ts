import mongoose from "mongoose";

let isConnected = false; // track connection state

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    // console.log(MONGODB_URI);

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    throw error;
  }
};
