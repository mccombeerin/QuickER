import mongoose, { Schema, Document } from "mongoose";

export interface RequestDocument extends Document {
  patientName: string;
  condition: string;
  urgency: "low" | "medium" | "high";
  hospitalId: mongoose.Types.ObjectId;
  requestTime: Date;
}

const RequestSchema = new Schema<RequestDocument>({
  patientName: { type: String, required: true },
  condition: { type: String, required: true },
  urgency: { type: String, enum: ["low", "medium", "high"], default: "low" },
  hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
  requestTime: { type: Date, default: Date.now },
});

export const Request = mongoose.model<RequestDocument>("Request", RequestSchema);
