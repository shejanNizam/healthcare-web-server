import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { JobPostControllers } from "./job_post.controller";
import { createJobPostSchema, updateJobPostSchema } from "./job_post.validation";

const router = Router();

router.get("/all", JobPostControllers.getAllJobs);
router.get("/single/:id", JobPostControllers.getSingleJob);

router.post(
  "/create",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(createJobPostSchema),
  JobPostControllers.createJob,
);

router.post(
  "/update/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(updateJobPostSchema),
  JobPostControllers.updateJob,
);

router.delete(
  "/delete/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  JobPostControllers.deleteJob,
);

export const JobPostRoutes = router;
