import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { ApplyControllers } from "../apply/apply.controller";
import { UserControllers } from "../user/user.controller";
import { DashboardControllers } from "./dashboard.controller";

const router = Router();

const adminOnly = checkAuth(UserRole.admin, UserRole.super_admin);

router.get("/over-view", adminOnly, DashboardControllers.getOverview);
router.get("/:year", adminOnly, DashboardControllers.getApplicantsByYear);

// Per spec: /dashboard/user-list and /dashboard/all-international-application live here
router.get("/user-list", adminOnly, UserControllers.getAllUsers);

router.get(
  "/all-international-application",
  adminOnly,
  ApplyControllers.getAllInternational,
);
router.get(
  "/single-international-application/:id",
  adminOnly,
  ApplyControllers.getSingleInternational,
);

export const DashboardRoutes = router;
