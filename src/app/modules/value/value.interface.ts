import { Document, Types } from "mongoose";

export enum ValueGroup {
  Category = "Category",
  Profession = "Profession",
  Discipline = "Discipline",
  Specialty = "Specialty",
  License = "License",
  JobType = "Job-type",
}

export interface IValueInitial {
  _id?: Types.ObjectId;
  group: ValueGroup;
  label: string;
  logo?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
}

export type IValue = IValueInitial & Document;
