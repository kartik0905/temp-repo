import OrganRequest from "../models/OrganRequest.js";
import { validationResult } from "express-validator";

export const createOrganRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", details: errors.array() });
    }

    const { userId } = req.user;

    const requestData = {
      ...req.body,
      patientUserId: userId,
    };

    const request = await OrganRequest.create(requestData);
    res.status(201).json(request);
  } catch (e) {
    next(e);
  }
};

export const getPatientRequests = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const requests = await OrganRequest.find({ patientUserId: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(requests);
  } catch (e) {
    next(e);
  }
};
