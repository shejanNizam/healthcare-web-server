import { Document, Types } from "mongoose";

export interface IBannerInitial {
  _id?: Types.ObjectId;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
  page?: string;
  position: number;
  isActive: boolean;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
}

export type IBanner = IBannerInitial & Document;
