import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { ValueControllers } from "./value.controller";
import { createValueSchema, updateValueSchema } from "./value.validation";

const router = Router();

router.get("/all/:group", ValueControllers.getAllByGroup);

router.post(
  "/create/:group",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(createValueSchema),
  ValueControllers.createValue,
);

router.post(
  "/update/:group/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(updateValueSchema),
  ValueControllers.updateValue,
);

router.delete(
  "/delete/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  ValueControllers.deleteValue,
);

export const ValueRoutes = router;
