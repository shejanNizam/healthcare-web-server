import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { CommunityControllers } from "./community.controller";

const router = Router();

const adminOnly = checkAuth(UserRole.admin, UserRole.super_admin);

router.get("/", adminOnly, CommunityControllers.getAll);
router.get("/details", adminOnly, CommunityControllers.getDetails);
router.delete("/delete", adminOnly, CommunityControllers.deleteCommunity);

export const CommunityRoutes = router;
