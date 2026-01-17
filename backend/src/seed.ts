import mongoose from "mongoose";
import dotenv from "dotenv";
import { Hospital } from "./models/hospital";

dotenv.config();

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not defined in .env");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB...");
    
    // family: 4 forces IPv4, which often fixes the "Could not connect" error on local networks
    await mongoose.connect(MONGODB_URI, {
      family: 4 
    });

    console.log("✅ MongoDB connected");

    const hospitals = [
      { name: "City Hospital", address: "123 Main St", capacity: 100, currentPatients: 0 },
      { name: "General Hospital", address: "456 Elm St", capacity: 80, currentPatients: 0 },
      { name: "St. Mary’s Hospital", address: "789 Oak St", capacity: 120, currentPatients: 0 },
    ];

    // Clear existing data to avoid duplicates
    await Hospital.deleteMany({});
    console.log("🗑️  Old data cleared");

    // Insert new data
    await Hospital.insertMany(hospitals);
    console.log("✅ Sample hospitals added successfully!");

    // Graceful exit
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Seed error details:", err.message);
    } else {
      console.error("❌ An unknown seed error occurred:", err);
    }
    process.exit(1);
  }
}

seed();