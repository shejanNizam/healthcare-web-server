import httpStatus from "http-status";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogServices } from "./blog.service";

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getAllBlogs(req.query as Record<string, string>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Blogs fetched successfully", ...result });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const data = await BlogServices.getSingleBlog(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Blog fetched successfully", data });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const data = await BlogServices.getCategories();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Blog categories fetched", data });
});

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const data = await BlogServices.createBlog(req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Blog created successfully", data });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const data = await BlogServices.updateBlog(req.params.id as string, req.body, req.user as JwtPayload);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Blog updated successfully", data });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  await BlogServices.deleteBlog(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Blog deleted successfully", data: null });
});

export const BlogControllers = { getAllBlogs, getSingleBlog, getCategories, createBlog, updateBlog, deleteBlog };
