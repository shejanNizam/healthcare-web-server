import { Document, Types } from "mongoose";

export interface ICommunityInitial {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  image?: string;
  isDeleted: boolean;
}

export type ICommunity = ICommunityInitial & Document;
