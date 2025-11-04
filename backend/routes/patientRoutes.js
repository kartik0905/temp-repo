import { Router } from "express";
import { body } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  createPatientProfile,
  getPatientProfile,
  updatePatientProfile,
} from "../controllers/patientController.js";

const router = Router();

const profileValidationRules = [
  body("name").isString().notEmpty(),
  body("email").isEmail(),
  body("age").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("bloodGroup").isString().notEmpty(),
  body("requiredOrgan").isString().notEmpty(),
  body("medicalCondition").optional().isString(),
  body("state").optional().isString(),
  body("city").optional().isString(),
];

router.post(
  "/",
  requireAuth,
  requireRole("patient"),
  profileValidationRules,
  createPatientProfile
);

router.get("/me", requireAuth, requireRole("patient"), getPatientProfile);

router.put(
  "/me",
  requireAuth,
  requireRole("patient"),
  profileValidationRules,
  updatePatientProfile
);

export default router;
