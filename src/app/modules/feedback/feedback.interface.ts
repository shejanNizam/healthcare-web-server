import { Document, Types } from "mongoose";

export interface IFeedbackInitial {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  heard: string;
  enjoy?: "yes" | "no";
  name?: string;
  email?: string;
  rating?: number;
  feedback?: string;
  isDeleted: boolean;
}

export type IFeedback = IFeedbackInitial & Document;
