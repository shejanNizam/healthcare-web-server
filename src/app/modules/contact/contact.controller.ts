import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContactServices } from "./contact.service";

const createContact = catchAsync(async (req: Request, res: Response) => {
  const data = await ContactServices.createContact(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Message sent successfully", data });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.getAllContacts(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Contacts fetched successfully", ...result });
});

const getSingleContact = catchAsync(async (req: Request, res: Response) => {
  const data = await ContactServices.getSingleContact(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Contact fetched successfully", data });
});

export const ContactControllers = { createContact, getAllContacts, getSingleContact };
