import { Document, Types } from "mongoose";

export enum ContentType {
  about = "about",
  terms = "terms",
  privacy = "privacy",
}

export interface IContentInitial {
  _id?: Types.ObjectId;
  type: ContentType;
  description: string;
  updatedBy?: Types.ObjectId;
}

export type IContent = IContentInitial & Document;
