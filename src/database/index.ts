import dns from "dns";
import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

export const connectDB = async (): Promise<void> => {
  try {
    if (MONGODB_URI.startsWith("mongodb+srv://")) {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch (dnsError) {
        console.warn("⚠️ Failed to set custom DNS servers for MongoDB Atlas SRV resolution:", dnsError);
      }
    }
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};

export const connectDBTest = async (uri?: string): Promise<void> => {
  try {
    const connectUri = uri || MONGODB_URI + "_test";
    if (connectUri.startsWith("mongodb+srv://")) {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch (dnsError) {
        console.warn("⚠️ Failed to set custom DNS servers for MongoDB Atlas SRV resolution:", dnsError);
      }
    }
    await mongoose.connect(connectUri);
  } catch (error) {
    console.error("❌ Test MongoDB connection failed", error);
    process.exit(1);
  }
};

export const closeDBTest = async (): Promise<void> => {
  try {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.dropDatabase();
    }
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Test MongoDB close failed", error);
    process.exit(1);
  }
};
