import httpStatus from "http-status";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JobPostServices } from "./job_post.service";

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await JobPostServices.getAllJobs(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Jobs fetched successfully", ...result });
});

const getSingleJob = catchAsync(async (req: Request, res: Response) => {
  const data = await JobPostServices.getSingleJob(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job fetched successfully", data });
});

const createJob = catchAsync(async (req: Request, res: Response) => {
  const data = await JobPostServices.createJob(req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Job created successfully", data });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const data = await JobPostServices.updateJob(req.params.id as string, req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job updated successfully", data });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  await JobPostServices.deleteJob(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Job deleted successfully", data: null });
});

export const JobPostControllers = { getAllJobs, getSingleJob, createJob, updateJob, deleteJob };
