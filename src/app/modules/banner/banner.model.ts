import { model, Schema } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    page: { type: String },
    position: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

bannerSchema.index({ page: 1, isActive: 1, position: 1 });

export const Banner = model<IBanner>("Banner", bannerSchema);
