import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { body } from "express-validator";

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
    body("userType", "User type is required").isIn([
      "admin",
      "donor",
      "patient",
    ]),
  ],
  registerUser
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginUser
);

export default router;
