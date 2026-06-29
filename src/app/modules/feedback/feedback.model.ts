import { model, Schema } from "mongoose";
import { IFeedback } from "./feedback.interface";

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    heard: { type: String, required: true },
    enjoy: { type: String, enum: ["yes", "no"] },
    name: { type: String },
    email: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const Feedback = model<IFeedback>("Feedback", feedbackSchema);
