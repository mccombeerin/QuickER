import mongoose, { Schema, Document } from "mongoose";

export interface HospitalDocument extends Document {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  capacity: number;
  currentWaitTime: number;
}

const HospitalSchema = new Schema<HospitalDocument>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  capacity: { type: Number, default: 0 },
  currentWaitTime: { type: Number, default: 0 },
});

export const Hospital = mongoose.model<HospitalDocument>("Hospital", HospitalSchema);