import { Document, Types } from "mongoose";

export enum ApplyType {
  local = "local",
  international = "international",
}

export interface IJobInfo {
  _id?: Types.ObjectId;
  fullName: string;
  email: string;
  gender?: "Male" | "Female" | "Other";
  phone: string;
  country: string;
  state: string;
  city: string;
  profession?: string;
  discipline?: string;
  specialty?: string;
  secondarySpecialty?: string;
}

export type IJobInfoDoc = IJobInfo & Document;

export interface IProfessionalLicense {
  _id?: Types.ObjectId;
  appliedJobId: Types.ObjectId;
  medicalAssistant?: string;
  city?: string;
  state?: string;
  licenseType?: string;
}

export interface IEducationHistory {
  _id?: Types.ObjectId;
  appliedJobId: Types.ObjectId;
  degree: string;
  school: string;
  year: string;
  major: string;
  city: string;
  country: string;
}

export interface IEmploymentHistory {
  _id?: Types.ObjectId;
  appliedJobId: Types.ObjectId;
  company?: string;
  specialty?: string;
  country?: string;
  state?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IAppliedJob {
  _id?: Types.ObjectId;
  applyType: ApplyType;
  userId?: Types.ObjectId;
  personalInfoId: Types.ObjectId;
  jobPostId?: Types.ObjectId;
  applicantEmail: string;
  applicantName: string;
  applicantPhone: string;
  certifications?: string[];
  isCompleted: boolean;
  isDeleted: boolean;
}

export type IAppliedJobDoc = IAppliedJob & Document;
