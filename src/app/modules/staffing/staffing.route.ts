import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { StaffingControllers } from "./staffing.controller";
import {
  createStaffingSchema,
  faqPatchSchema,
  updateStaffingSchema,
  whatWeDoSchema,
} from "./staffing.validation";

const router = Router();

router.get("/all", StaffingControllers.getAll);
router.get("/all-faq", StaffingControllers.getAllFaqs);
router.get("/:id", StaffingControllers.getSingle);

router.post(
  "/create",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(createStaffingSchema),
  StaffingControllers.create,
);

router.post(
  "/update/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(updateStaffingSchema),
  StaffingControllers.update,
);

router.patch(
  "/FQA/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(faqPatchSchema),
  StaffingControllers.patchFaq,
);

router.patch(
  "/what_we_do/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  validateRequest(whatWeDoSchema),
  StaffingControllers.patchWhatWeDo,
);

export const StaffingRoutes = router;
