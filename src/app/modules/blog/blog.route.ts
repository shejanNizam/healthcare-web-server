import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { BlogControllers } from "./blog.controller";
import { createBlogSchema, updateBlogSchema } from "./blog.validation";

const router = Router();

router.get("/all", BlogControllers.getAllBlogs);
router.get("/category/blogs", BlogControllers.getCategories);
router.get("/single/:id", BlogControllers.getSingleBlog);

router.post(
  "/create",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(createBlogSchema),
  BlogControllers.createBlog,
);

router.post(
  "/edit/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(updateBlogSchema),
  BlogControllers.updateBlog,
);

router.delete(
  "/delete/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  BlogControllers.deleteBlog,
);

export const BlogRoutes = router;
