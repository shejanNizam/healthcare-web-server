import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { ContactControllers } from "./contact.controller";

const router = Router();

router.post("/create", ContactControllers.createContact);

router.get(
  "/all",
  checkAuth(UserRole.admin, UserRole.super_admin),
  ContactControllers.getAllContacts,
);

router.get(
  "/single/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  ContactControllers.getSingleContact,
);

export const ContactRoutes = router;
