import Donor from "../models/Donor.js";
import { validationResult } from "express-validator";

export const createDonorProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", details: errors.array() });
    }

    const { userId } = req.user;

    const existingProfile = await Donor.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({ message: "Donor profile already exists" });
    }

    const donorData = {
      ...req.body,
      userId: userId,
    };

    const donor = await Donor.create(donorData);
    res.status(201).json(donor);
  } catch (e) {
    next(e);
  }
};

export const getDonorProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const donor = await Donor.findOne({ userId });

    if (!donor) {
      return res.status(404).json({ message: "Donor profile not found" });
    }
    res.status(200).json(donor);
  } catch (e) {
    next(e);
  }
};

export const updateDonorProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", details: errors.array() });
    }

    const { userId } = req.user;

    const donor = await Donor.findOneAndUpdate(
      { userId: userId },
      { $set: req.body },
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ message: "Donor profile not found" });
    }

    res.status(200).json(donor);
  } catch (e) {
    next(e);
  }
};
