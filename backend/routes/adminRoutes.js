import { Router } from "express";
import { body } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  getAllRequests,
  updateRequestStatus,
} from "../controllers/adminController.js";

const router = Router();

router.get("/requests", requireAuth, requireRole("admin"), getAllRequests);

router.patch(
  "/requests/:id/status",
  requireAuth,
  requireRole("admin"),
  [body("status").isIn(["pending", "approved", "rejected"])],
  updateRequestStatus
);

export default router;
