// backend/src/index.ts

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

async function startServer() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("MONGODB_URI not defined in .env");

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Create Express app
    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(express.json()); // parse JSON request bodies

    // API routes
    app.use("/api", router);

    // Root route for testing
    app.get("/", (_req, res) => res.send("Backend is running"));

    // Start server
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ MongoDB connection error:", err.message);
    } else {
      console.error("❌ MongoDB connection error:", err);
    }
  }
}

// Start the server
startServer();