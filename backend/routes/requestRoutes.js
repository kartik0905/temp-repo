import { Router } from "express";
import { body } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  createOrganRequest,
  getPatientRequests,
} from "../controllers/requestController.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("patient"),
  [
    body("patientName").isString().notEmpty(),
    body("patientEmail").isEmail(),
    body("organ").isString().notEmpty(),
    body("bloodGroup").isString().notEmpty(),
    body("phone").isString().notEmpty(),
    body("age").isString().notEmpty(),
    body("state").isString().notEmpty(),
    body("city").isString().notEmpty(),
    body("urgency").isIn(["low", "medium", "high"]),
    body("medicalCondition").optional().isString(),
  ],
  createOrganRequest
);

router.get(
  "/my-requests",
  requireAuth,
  requireRole("patient"),
  getPatientRequests
);

export default router;

