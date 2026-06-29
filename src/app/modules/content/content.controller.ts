import httpStatus from "http-status";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContentType } from "./content.interface";
import { ContentServices } from "./content.service";

const makeGetHandler = (type: ContentType) =>
  catchAsync(async (req: Request, res: Response) => {
    const data = await ContentServices.getByType(type);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: `${type} fetched successfully`, data });
  });

const makeUpdateHandler = (type: ContentType) =>
  catchAsync(async (req: Request, res: Response) => {
    const data = await ContentServices.upsertByType(type, req.body.description, req.user as JwtPayload);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: `${type} updated successfully`, data });
  });

export const ContentControllers = {
  getAbout: makeGetHandler(ContentType.about),
  updateAbout: makeUpdateHandler(ContentType.about),
  getTerms: makeGetHandler(ContentType.terms),
  updateTerms: makeUpdateHandler(ContentType.terms),
  getPrivacy: makeGetHandler(ContentType.privacy),
  updatePrivacy: makeUpdateHandler(ContentType.privacy),
};
