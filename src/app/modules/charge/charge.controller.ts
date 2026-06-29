import httpStatus from "http-status";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ChargeServices } from "./charge.service";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await ChargeServices.getAll();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Charge config fetched", data });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id, ...payload } = req.body;
  const data = await ChargeServices.update(id, payload, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Charge config updated", data });
});

export const ChargeControllers = { getAll, update };
