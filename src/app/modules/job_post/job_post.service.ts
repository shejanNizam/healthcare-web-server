import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import AppError from "../../errorHelpers/AppError";
import { IJobPost } from "./job_post.interface";
import { JobPost } from "./job_post.model";

const getAllJobs = async (query: Record<string, string>) => {
  const baseQuery = JobPost.find({ isDeleted: false });
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.search(["title", "hospitalName"]).filter().sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

const getSingleJob = async (id: string) => {
  const job = await JobPost.findOne({ _id: id, isDeleted: false });
  if (!job) throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  return job;
};

const createJob = async (payload: Partial<IJobPost>, user: JwtPayload) => {
  return JobPost.create({ ...payload, createdBy: user._id });
};

const updateJob = async (id: string, payload: Partial<IJobPost>, user: JwtPayload) => {
  const job = await JobPost.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { ...payload, updatedBy: user._id },
    { returnDocument: "after", runValidators: true },
  );
  if (!job) throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  return job;
};

const deleteJob = async (id: string) => {
  const job = await JobPost.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { returnDocument: "after" },
  );
  if (!job) throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  return job;
};

export const JobPostServices = { getAllJobs, getSingleJob, createJob, updateJob, deleteJob };
