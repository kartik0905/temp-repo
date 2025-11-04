const bloodCompatibilityMap = {

  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], 
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"], 
};
import OrganRequest from "../models/OrganRequest.js";
import Donor from "../models/Donor.js";
import { validationResult } from "express-validator";

export const getAllRequests = async (req, res, next) => {
  try {
    const requests = await OrganRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (e) {
    next(e);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input", details: errors.array() });
    }

    const { status } = req.body;
    const { id } = req.params;

    const updatedRequest = await OrganRequest.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (e) {
    next(e);
  }
};


export const findMatchingDonors = async (req, res, next) => {
  try {
    const { id } = req.params;


    const request = await OrganRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Organ request not found" });
    }

    const patientBloodGroup = request.bloodGroup;
    const patientNeededOrgan = request.organ;


    const compatibleDonorTypes = bloodCompatibilityMap[patientBloodGroup];
    if (!compatibleDonorTypes) {
      return res
        .status(400)
        .json({ message: "Invalid patient blood type in request" });
    }


    const matches = await Donor.find({
      organType: patientNeededOrgan, 
      bloodGroup: { $in: compatibleDonorTypes }, 
    });

    res.status(200).json(matches);
  } catch (e) {
    next(e);
  }
};