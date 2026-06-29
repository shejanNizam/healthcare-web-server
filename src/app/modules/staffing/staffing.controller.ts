import httpStatus from "http-status";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StaffingServices } from "./staffing.service";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await StaffingServices.getAll();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Staffing solutions fetched", data });
});

const getSingle = catchAsync(async (req: Request, res: Response) => {
  const data = await StaffingServices.getSingle(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Staffing solution fetched", data });
});

const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
  const data = await StaffingServices.getAllFaqs();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "FAQs fetched", data });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const data = await StaffingServices.create(req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Staffing solution created", data });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const data = await StaffingServices.update(req.params.id as string, req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Staffing solution updated", data });
});

const patchFaq = catchAsync(async (req: Request, res: Response) => {
  const data = await StaffingServices.patchFaq(req.params.id as string, req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "FAQ updated", data });
});

const patchWhatWeDo = catchAsync(async (req: Request, res: Response) => {
  const data = await StaffingServices.patchWhatWeDo(req.params.id as string, req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "What we do updated", data });
});

export const StaffingControllers = { getAll, getSingle, getAllFaqs, create, update, patchFaq, patchWhatWeDo };
