import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

async function startServer() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("MONGODB_URI not defined in .env");

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    const app = express();
    const PORT = process.env.PORT || 5000;

    app.use(express.json());
    app.use("/api", router);

    app.get("/", (_req, res) => res.send("Backend is running"));

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    if (err instanceof Error) console.error("❌ MongoDB connection error:", err.message);
    else console.error("❌ MongoDB connection error:", err);
  }
}

startServer();