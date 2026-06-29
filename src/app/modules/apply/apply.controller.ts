import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ApplyServices } from "./apply.service";

const step1 = catchAsync(async (req: Request, res: Response) => {
  const data = await ApplyServices.step1PersonalInfo(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Personal info saved successfully", data });
});

const step2 = catchAsync(async (req: Request, res: Response) => {
  const data = await ApplyServices.step2Education(req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Education info saved successfully", data });
});

const step3 = catchAsync(async (req: Request, res: Response) => {
  const data = await ApplyServices.step3Employment(req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Application completed successfully", data });
});

const getAllForJob = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplyServices.getAllForJob(req.params.id as string, req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Applicants fetched successfully", ...result });
});

const getSingleApplication = catchAsync(async (req: Request, res: Response) => {
  const data = await ApplyServices.getSingleApplication(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Application fetched successfully", data });
});

const getAllInternational = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplyServices.getAllInternational(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "International applications fetched", ...result });
});

const getSingleInternational = catchAsync(async (req: Request, res: Response) => {
  const data = await ApplyServices.getSingleInternational(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "International application fetched", data });
});

export const ApplyControllers = {
  step1,
  step2,
  step3,
  getAllForJob,
  getSingleApplication,
  getAllInternational,
  getSingleInternational,
};
