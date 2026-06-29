import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { BannerControllers } from "./banner.controller";

const router = Router();

router.get("/", BannerControllers.getActiveBanners);

router.post(
  "/create",
  checkAuth(UserRole.admin, UserRole.super_admin),
  BannerControllers.create,
);

router.patch(
  "/update",
  checkAuth(UserRole.admin, UserRole.super_admin),
  BannerControllers.update,
);

router.delete(
  "/delete",
  checkAuth(UserRole.admin, UserRole.super_admin),
  BannerControllers.deleteBanner,
);

export const BannerRoutes = router;
