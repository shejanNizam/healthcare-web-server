import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import AppError from "../../errorHelpers/AppError";
import { IBanner } from "./banner.interface";
import { Banner } from "./banner.model";

const getActiveBanners = async (query: Record<string, string>) => {
  const baseQuery = Banner.find({ isActive: true, isDeleted: false }).sort("position");
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

const create = async (payload: Partial<IBanner>, user: JwtPayload) => {
  return Banner.create({ ...payload, createdBy: user._id });
};

const update = async (id: string, payload: Partial<IBanner>) => {
  const banner = await Banner.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { returnDocument: "after", runValidators: true },
  );
  if (!banner) throw new AppError(httpStatus.NOT_FOUND, "Banner not found");
  return banner;
};

const deleteBanner = async (id: string) => {
  const banner = await Banner.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { returnDocument: "after" },
  );
  if (!banner) throw new AppError(httpStatus.NOT_FOUND, "Banner not found");
  return banner;
};

export const BannerServices = { getActiveBanners, create, update, deleteBanner };
