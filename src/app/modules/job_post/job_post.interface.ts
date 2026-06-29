import { Document, Types } from "mongoose";

export enum JobType {
  contract = "contract",
  partTime = "part-time",
  fullTime = "full-time",
  perDiem = "per-diem",
}

export enum SalaryPeriod {
  hour = "hour",
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export interface IJobPostInitial {
  _id?: Types.ObjectId;
  hospitalName: string;
  title: string;
  address?: string;
  deadline?: Date;
  category?: string;
  profession?: string;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  salaryPeriod: SalaryPeriod;
  vacancy?: number;
  startDate?: Date;
  hoursPerWeek: number;
  description: string;
  summary?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  companyLogo?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export type IJobPost = IJobPostInitial & Document;
