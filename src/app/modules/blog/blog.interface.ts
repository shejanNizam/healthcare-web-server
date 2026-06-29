import { Document, Types } from "mongoose";

export interface IBlogInitial {
  _id?: Types.ObjectId;
  category: string;
  blogTitle: string;
  description: string;
  banner: string;
  metaDescription: string;
  tags?: string[];
  pageTitle: string;
  url: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export type IBlog = IBlogInitial & Document;
