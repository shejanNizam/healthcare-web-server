import httpStatus from "http-status";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FeedbackServices } from "./feedback.service";

const createFeedback = catchAsync(async (req: Request, res: Response) => {
  const data = await FeedbackServices.createFeedback(req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Feedback submitted successfully", data });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackServices.getAll(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Feedback fetched successfully", ...result });
});

export const FeedbackControllers = { createFeedback, getAll };
