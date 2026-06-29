import { model, Schema } from "mongoose";
import { IStaffing, IStaffingFaqDoc, StaffingType } from "./staffing.interface";

const staffingSchema = new Schema<IStaffing>(
  {
    bannerTitle: { type: String, required: true },
    bannerSubTitle: { type: String, required: true },
    pageTitle: { type: String, required: true },
    type: { type: String, enum: Object.values(StaffingType), required: true, unique: true },
    url: { type: String, required: true, unique: true },
    metaDescription: { type: String, required: true },
    guaranteesDescription: [{ type: String }],
    patientCareDescription: [{ type: String }],
    serviceSuccessDescription: [{ type: String }],
    specialityDescription: [{ type: String }],
    standsDescription: [{ type: String }],
    whatWeDo: [{ type: String }],
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

export const Staffing = model<IStaffing>("Staffing", staffingSchema);

const staffingFaqSchema = new Schema<IStaffingFaqDoc>(
  {
    staffingId: { type: Schema.Types.ObjectId, ref: "Staffing", required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { versionKey: false },
);

export const StaffingFaq = model<IStaffingFaqDoc>("StaffingFaq", staffingFaqSchema);
