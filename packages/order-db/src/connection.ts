import mongoose from "mongoose";
import dns from "node:dns";

export const connectOrderDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in env file!");
  }

  try {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
      // ignore DNS server override errors
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB (Order DB)");
  } catch (error) {
    console.error("⚠️ Failed to connect to MongoDB:", error);
  }
};
