import httpStatus from "http-status";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BannerServices } from "./banner.service";

const getActiveBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await BannerServices.getActiveBanners(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Banners fetched successfully", ...result });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const data = await BannerServices.create(req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Banner created successfully", data });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id, ...payload } = req.body;
  const data = await BannerServices.update(id, payload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Banner updated successfully", data });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;
  await BannerServices.deleteBanner(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Banner deleted successfully", data: null });
});

export const BannerControllers = { getActiveBanners, create, update, deleteBanner };
