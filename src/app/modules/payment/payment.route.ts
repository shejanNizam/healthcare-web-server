import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.get(
  "/history",
  checkAuth(UserRole.admin, UserRole.super_admin),
  PaymentControllers.getHistory,
);

export const PaymentRoutes = router;
