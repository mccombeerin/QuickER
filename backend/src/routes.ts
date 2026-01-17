import express from "express";
import { Hospital } from "./models/Hospital";
import { Request } from "./models/Request"; 

const router = express.Router();

// Get all hospitals
router.get("/hospitals", async (_req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});

// Add a new patient request
router.post("/requests", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
