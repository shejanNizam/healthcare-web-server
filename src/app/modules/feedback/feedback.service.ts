import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { User } from "../user/user.model";
import { Feedback } from "./feedback.model";

const createFeedback = async (
  payload: { heard: string; enjoy?: "yes" | "no"; rating?: number; feedback?: string },
  user: JwtPayload,
) => {
  const userData = await User.findById(user._id).select("name email");
  return Feedback.create({
    ...payload,
    userId: user._id,
    name: userData?.name,
    email: userData?.email,
  });
};

const getAll = async (query: Record<string, string>) => {
  const baseQuery = Feedback.find({ isDeleted: false }).populate("userId", "name email");
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

export const FeedbackServices = { createFeedback, getAll };
