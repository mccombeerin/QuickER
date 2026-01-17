import mongoose, { Schema, Document } from "mongoose";

export interface IHospital extends Document {
  name: string;
  address: string;
  capacity: number;
  currentPatients: number;
}

const hospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentPatients: { type: Number, default: 0 },
});

export const Hospital = mongoose.model<IHospital>("Hospital", hospitalSchema);