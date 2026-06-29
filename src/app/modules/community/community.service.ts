import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Community } from "./community.model";

const getAll = async (query: Record<string, string>) => {
  const baseQuery = Community.find({ isDeleted: false });
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

const getDetails = async (id: string) => {
  const community = await Community.findOne({ _id: id, isDeleted: false });
  if (!community) throw new AppError(httpStatus.NOT_FOUND, "Community not found");
  return community;
};

const deleteCommunity = async (id: string) => {
  const community = await Community.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { returnDocument: "after" },
  );
  if (!community) throw new AppError(httpStatus.NOT_FOUND, "Community not found");
  return community;
};

export const CommunityServices = { getAll, getDetails, deleteCommunity };
