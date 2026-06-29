import httpStatus from "http-status";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import AppError from "../../errorHelpers/AppError";
import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";

const getAllBlogs = async (query: Record<string, string>) => {
  const baseQuery = Blog.find({ isDeleted: false });
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.search(["blogTitle", "category"]).filter().sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

const getSingleBlog = async (idOrSlug: string) => {
  const isId = mongoose.isValidObjectId(idOrSlug);
  const filter = isId
    ? { $or: [{ _id: idOrSlug }, { url: idOrSlug }], isDeleted: false }
    : { url: idOrSlug, isDeleted: false };

  const blog = await Blog.findOne(filter);
  if (!blog) throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  return blog;
};

const getCategories = async () => {
  return Blog.distinct("category", { isDeleted: false });
};

const createBlog = async (payload: Partial<IBlog>, user: JwtPayload) => {
  const exists = await Blog.findOne({ url: payload.url });
  if (exists) throw new AppError(httpStatus.CONFLICT, "A blog with this URL/slug already exists");
  return Blog.create({ ...payload, createdBy: user._id });
};

const updateBlog = async (id: string, payload: Partial<IBlog>, user: JwtPayload) => {
  if (payload.url) {
    const dup = await Blog.findOne({ url: payload.url, _id: { $ne: id }, isDeleted: false });
    if (dup) throw new AppError(httpStatus.CONFLICT, "A blog with this URL/slug already exists");
  }
  const blog = await Blog.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { ...payload, updatedBy: user._id },
    { returnDocument: "after", runValidators: true },
  );
  if (!blog) throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  return blog;
};

const deleteBlog = async (id: string) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { returnDocument: "after" },
  );
  if (!blog) throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  return blog;
};

export const BlogServices = { getAllBlogs, getSingleBlog, getCategories, createBlog, updateBlog, deleteBlog };
