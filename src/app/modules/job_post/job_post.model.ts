import { model, Schema } from "mongoose";
import { IJobPost, JobType, SalaryPeriod } from "./job_post.interface";

const jobPostSchema = new Schema<IJobPost>(
  {
    hospitalName: { type: String, required: true },
    title: { type: String, required: true },
    address: { type: String },
    deadline: { type: Date },
    category: { type: String },
    profession: { type: String },
    jobType: { type: String, enum: Object.values(JobType), required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: "USD" },
    salaryPeriod: { type: String, enum: Object.values(SalaryPeriod), default: SalaryPeriod.year },
    vacancy: { type: Number },
    startDate: { type: Date },
    hoursPerWeek: { type: Number, required: true },
    description: { type: String, required: true },
    summary: { type: String },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    companyLogo: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

jobPostSchema.index({ category: 1, profession: 1, jobType: 1 });
jobPostSchema.index({ deadline: 1 });
jobPostSchema.index({ isDeleted: 1 });

export const JobPost = model<IJobPost>("JobPost", jobPostSchema);
