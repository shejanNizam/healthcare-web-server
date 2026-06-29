import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { FeedbackControllers } from "./feedback.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.user, UserRole.admin, UserRole.super_admin),
  FeedbackControllers.createFeedback,
);

router.get(
  "/all",
  checkAuth(UserRole.admin, UserRole.super_admin),
  FeedbackControllers.getAll,
);

export const FeedbackRoutes = router;
