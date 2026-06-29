import { model, Schema } from "mongoose";
import { IBlog } from "./blog.interface";

const blogSchema = new Schema<IBlog>(
  {
    category: { type: String, required: true },
    blogTitle: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String, required: true },
    metaDescription: { type: String, required: true },
    tags: [{ type: String }],
    pageTitle: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

blogSchema.index({ category: 1 });
blogSchema.index({ isDeleted: 1 });

export const Blog = model<IBlog>("Blog", blogSchema);
