import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NotificationServices } from "./notification.service";

const getAdminNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationServices.getAdminNotifications(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Notifications fetched successfully", ...result });
});

const markRead = catchAsync(async (req: Request, res: Response) => {
  const data = await NotificationServices.markRead(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Notification marked as read", data });
});

export const NotificationControllers = { getAdminNotifications, markRead };
