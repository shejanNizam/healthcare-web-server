import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const getHistory = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getHistory(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Payment history fetched", ...result });
});

export const PaymentControllers = { getHistory };
