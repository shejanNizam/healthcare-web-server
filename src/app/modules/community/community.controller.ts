import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommunityServices } from "./community.service";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await CommunityServices.getAll(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Communities fetched", ...result });
});

const getDetails = catchAsync(async (req: Request, res: Response) => {
  const id = (req.query.id || req.body.id) as string;
  const data = await CommunityServices.getDetails(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Community fetched", data });
});

const deleteCommunity = catchAsync(async (req: Request, res: Response) => {
  const id = (req.query.id || req.body.id) as string;
  await CommunityServices.deleteCommunity(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Community deleted", data: null });
});

export const CommunityControllers = { getAll, getDetails, deleteCommunity };
