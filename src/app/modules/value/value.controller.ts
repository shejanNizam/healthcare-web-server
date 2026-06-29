import httpStatus from "http-status";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ValueServices } from "./value.service";

const getAllByGroup = catchAsync(async (req: Request, res: Response) => {
  const data = await ValueServices.getAllByGroup(req.params.group as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Values fetched successfully", data });
});

const createValue = catchAsync(async (req: Request, res: Response) => {
  const data = await ValueServices.createValue(req.params.group as string, req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Value created successfully", data });
});

const updateValue = catchAsync(async (req: Request, res: Response) => {
  const data = await ValueServices.updateValue(req.params.group as string, req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Value updated successfully", data });
});

const deleteValue = catchAsync(async (req: Request, res: Response) => {
  await ValueServices.deleteValue(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Value deleted successfully", data: null });
});

export const ValueControllers = { getAllByGroup, createValue, updateValue, deleteValue };
