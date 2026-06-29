import { model, Schema } from "mongoose";
import { ContentType, IContent } from "./content.interface";

const contentSchema = new Schema<IContent>(
  {
    type: { type: String, enum: Object.values(ContentType), required: true, unique: true },
    description: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

export const Content = model<IContent>("Content", contentSchema);
