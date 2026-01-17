import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  patientName: string;
  condition: string;
  urgency: string;
  hospital: string;
  createdAt: Date;
}

const requestSchema = new Schema<IRequest>({
  patientName: { type: String, required: true },
  condition: { type: String, required: true },
  urgency: { type: String, required: true },
  hospital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Request = mongoose.model<IRequest>("Request", requestSchema);
