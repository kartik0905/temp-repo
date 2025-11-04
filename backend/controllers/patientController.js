import Patient from "../models/Patient.js";
import { validationResult } from "express-validator";

export const createPatientProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", details: errors.array() });
    }

    const { userId } = req.user;

    const existingProfile = await Patient.findOne({ userId });
    if (existingProfile) {
      return res
        .status(409)
        .json({ message: "Patient profile already exists" });
    }

    const profileData = {
      ...req.body,
      userId: userId,
    };

    const patient = await Patient.create(profileData);
    res.status(201).json(patient);
  } catch (e) {
    next(e);
  }
};

export const getPatientProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const patient = await Patient.findOne({ userId });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }
    res.status(200).json(patient);
  } catch (e) {
    next(e);
  }
};

export const updatePatientProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", details: errors.array() });
    }

    const { userId } = req.user;

    const patient = await Patient.findOneAndUpdate(
      { userId: userId },
      { $set: req.body },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    res.status(200).json(patient);
  } catch (e) {
    next(e);
  }
};
