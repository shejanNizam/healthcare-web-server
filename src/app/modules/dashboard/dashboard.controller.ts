import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DashboardServices } from "./dashboard.service";

const getOverview = catchAsync(async (req: Request, res: Response) => {
  const data = await DashboardServices.getOverview();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Overview fetched successfully", data });
});

const getApplicantsByYear = catchAsync(async (req: Request, res: Response) => {
  const year = parseInt(req.params.year as string, 10) || new Date().getFullYear();
  const data = await DashboardServices.getApplicantsByMonth(year);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Applicants by month fetched", data });
});

export const DashboardControllers = { getOverview, getApplicantsByYear };
