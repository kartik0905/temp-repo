import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// Function to generate a token
const generateToken = (user) => {
  const payload = {
    userId: user._id, // This is the fix we talked about!
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// --- Register User ---
export const registerUser = async (req, res, next) => {
  try {
    // 1. Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", details: errors.array() });
    }

    // 2. Get data from request body
    const { name, email, password, userType } = req.body;

    // 3. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Create new user
    user = new User({
      name,
      email,
      passwordHash,
      role: userType, // <-- We map frontend 'userType' to backend 'role'
    });

    // 6. Save user to database
    await user.save();

    // 7. Create token
    const token = generateToken(user);

    // 8. Send response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
};

// --- Login User ---
export const loginUser = async (req, res, next) => {
  try {
    // 1. Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", details: errors.array() });
    }

    // 2. Get data from request body
    const { email, password } = req.body;

    // 3. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 5. Create token
    const token = generateToken(user);

    // 6. Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
};
