import { Document, Types } from "mongoose";

export enum StaffingType {
  workforceSolutions = "workforce_solutions",
  staffingSolutions = "staffing_solutions",
}

export interface IStaffingFaq {
  _id?: Types.ObjectId;
  staffingId: Types.ObjectId;
  question: string;
  answer: string;
}

export interface IStaffingInitial {
  _id?: Types.ObjectId;
  bannerTitle: string;
  bannerSubTitle: string;
  pageTitle: string;
  type: StaffingType;
  url: string;
  metaDescription: string;
  guaranteesDescription?: string[];
  patientCareDescription?: string[];
  serviceSuccessDescription?: string[];
  specialityDescription?: string[];
  standsDescription?: string[];
  whatWeDo?: string[];
  updatedBy?: Types.ObjectId;
}

export type IStaffing = IStaffingInitial & Document;
export type IStaffingFaqDoc = IStaffingFaq & Document;
