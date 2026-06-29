import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { ApplyControllers } from "./apply.controller";
import { step1Schema, step2Schema, step3Schema } from "./apply.validation";

const router = Router();

// Public — 3-step application flow
router.post("/personal-info", validateRequest(step1Schema), ApplyControllers.step1);
router.post("/create/:id", validateRequest(step2Schema), ApplyControllers.step2);
router.put("/education-info/:id", validateRequest(step3Schema), ApplyControllers.step3);

// Admin — review
router.get(
  "/all/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  ApplyControllers.getAllForJob,
);
router.get(
  "/single/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  ApplyControllers.getSingleApplication,
);

export const ApplyRoutes = router;
