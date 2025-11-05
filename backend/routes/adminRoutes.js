import { Router } from "express";
import { body } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  getAllRequests,
  updateRequestStatus,
  findMatchingDonors,
  assignDonorToRequest,
} from "../controllers/adminController.js";

const router = Router();

router.get("/requests", requireAuth, requireRole("admin"), getAllRequests);

router.get(
  "/requests/:id/find-matches",
  requireAuth,
  requireRole("admin"),
  findMatchingDonors
);

router.patch(
  "/requests/:id/status",
  requireAuth,
  requireRole("admin"),
  [body("status").isIn(["pending", "approved", "rejected"])],
  updateRequestStatus
);
router.patch(
  "/requests/:id/assign",
  requireAuth,
  requireRole("admin"),
  assignDonorToRequest
);

export default router;
