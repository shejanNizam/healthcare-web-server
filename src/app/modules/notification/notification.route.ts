import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { NotificationControllers } from "./notification.controller";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.admin, UserRole.super_admin),
  NotificationControllers.getAdminNotifications,
);

router.patch(
  "/read/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  NotificationControllers.markRead,
);

export const NotificationRoutes = router;
