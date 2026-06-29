import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { ChargeControllers } from "./charge.controller";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.admin, UserRole.super_admin),
  ChargeControllers.getAll,
);

router.patch(
  "/update",
  checkAuth(UserRole.admin, UserRole.super_admin),
  ChargeControllers.update,
);

export const ChargeRoutes = router;
