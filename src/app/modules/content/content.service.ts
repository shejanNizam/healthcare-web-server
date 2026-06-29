import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { ContentType } from "./content.interface";
import { Content } from "./content.model";

const getByType = async (type: ContentType) => {
  const content = await Content.findOne({ type });
  if (!content) throw new AppError(httpStatus.NOT_FOUND, `${type} content not found`);
  return content;
};

const upsertByType = async (type: ContentType, description: string, user: JwtPayload) => {
  return Content.findOneAndUpdate(
    { type },
    { description, updatedBy: user._id },
    { returnDocument: "after", upsert: true, runValidators: true },
  );
};

export const ContentServices = { getByType, upsertByType };
