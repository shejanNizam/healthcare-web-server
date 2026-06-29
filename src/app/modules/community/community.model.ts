import { model, Schema } from "mongoose";
import { ICommunity } from "./community.interface";

const communitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const Community = model<ICommunity>("Community", communitySchema);
