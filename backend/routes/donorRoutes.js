import { Router } from "express";
import { body } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  createDonorProfile,
  getDonorProfile,
  updateDonorProfile,
  getDonorHistory,
} from "../controllers/donorController.js";

const router = Router();

const donorValidationRules = [
  body("fullName").isString().notEmpty(),
  body("dateOfBirth").isString().notEmpty(),
  body("bloodGroup").isString().notEmpty(),
  body("organType").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("state").isString().notEmpty(),
  body("zipCode").isString().notEmpty(),
  body("emergencyContactName").isString().notEmpty(),
  body("emergencyContactPhone").isString().notEmpty(),
  body("medicalHistory").optional().isString(),
];

router.post(
  "/",
  requireAuth,
  requireRole("donor"),
  donorValidationRules,
  createDonorProfile
);

router.get("/me", requireAuth, requireRole("donor"), getDonorProfile);

router.put(
  "/me",
  requireAuth,
  requireRole("donor"),
  donorValidationRules,
  updateDonorProfile
);

router.get("/me/history", requireAuth, requireRole("donor"), getDonorHistory);

export default router;
