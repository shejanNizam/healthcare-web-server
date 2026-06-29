import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { ContentControllers } from "./content.controller";

const router = Router();

// About
router.get("/about", ContentControllers.getAbout);
router.post("/about/update", checkAuth(UserRole.admin, UserRole.super_admin), ContentControllers.updateAbout);

// Terms
router.get("/terms", ContentControllers.getTerms);
router.post("/terms/update", checkAuth(UserRole.admin, UserRole.super_admin), ContentControllers.updateTerms);

// Privacy
router.get("/privacy", ContentControllers.getPrivacy);
router.post("/privacy/update", checkAuth(UserRole.admin, UserRole.super_admin), ContentControllers.updatePrivacy);

export const ContentRoutes = router;
