import { model, Schema } from "mongoose";
import {
  ApplyType,
  IAppliedJobDoc,
  IEducationHistory,
  IEmploymentHistory,
  IJobInfoDoc,
  IProfessionalLicense,
} from "./apply.interface";

// ─── JobInfo ────────────────────────────────────────────────────────────────

const jobInfoSchema = new Schema<IJobInfoDoc>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    profession: { type: String },
    discipline: { type: String },
    specialty: { type: String },
    secondarySpecialty: { type: String },
  },
  { timestamps: true, versionKey: false },
);

jobInfoSchema.index({ email: 1 });

export const JobInfo = model<IJobInfoDoc>("JobInfo", jobInfoSchema);

// ─── AppliedJob ─────────────────────────────────────────────────────────────

const appliedJobSchema = new Schema<IAppliedJobDoc>(
  {
    applyType: { type: String, enum: Object.values(ApplyType), default: ApplyType.local },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    personalInfoId: { type: Schema.Types.ObjectId, ref: "JobInfo", required: true },
    jobPostId: { type: Schema.Types.ObjectId, ref: "JobPost" },
    applicantEmail: { type: String, required: true },
    applicantName: { type: String, required: true },
    applicantPhone: { type: String, required: true },
    certifications: [{ type: String }],
    isCompleted: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

// Partial unique index: prevents duplicate application to the same job; ignores international (no job)
appliedJobSchema.index(
  { applicantEmail: 1, jobPostId: 1 },
  { unique: true, partialFilterExpression: { jobPostId: { $exists: true, $ne: null } } },
);
appliedJobSchema.index({ applyType: 1, isCompleted: 1 });
appliedJobSchema.index({ jobPostId: 1 });
appliedJobSchema.index({ userId: 1 });

export const AppliedJob = model<IAppliedJobDoc>("AppliedJob", appliedJobSchema);

// ─── ProfessionalLicense ─────────────────────────────────────────────────────

const professionalLicenseSchema = new Schema<IProfessionalLicense>(
  {
    appliedJobId: { type: Schema.Types.ObjectId, ref: "AppliedJob", required: true },
    medicalAssistant: { type: String },
    city: { type: String },
    state: { type: String },
    licenseType: { type: String },
  },
  { versionKey: false },
);

export const ProfessionalLicense = model<IProfessionalLicense>(
  "ProfessionalLicense",
  professionalLicenseSchema,
);

// ─── EducationHistory ────────────────────────────────────────────────────────

const educationHistorySchema = new Schema<IEducationHistory>(
  {
    appliedJobId: { type: Schema.Types.ObjectId, ref: "AppliedJob", required: true },
    degree: { type: String, required: true },
    school: { type: String, required: true },
    year: { type: String, required: true },
    major: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  { versionKey: false },
);

export const EducationHistory = model<IEducationHistory>(
  "EducationHistory",
  educationHistorySchema,
);

// ─── EmploymentHistory ───────────────────────────────────────────────────────

const employmentHistorySchema = new Schema<IEmploymentHistory>(
  {
    appliedJobId: { type: Schema.Types.ObjectId, ref: "AppliedJob", required: true },
    company: { type: String },
    specialty: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { versionKey: false },
);

export const EmploymentHistory = model<IEmploymentHistory>(
  "EmploymentHistory",
  employmentHistorySchema,
);
