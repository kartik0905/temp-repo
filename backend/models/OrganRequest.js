import mongoose from "mongoose";

const organRequestSchema = new mongoose.Schema(
  {
    patientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    organ: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    urgency: { type: String, enum: ["low", "medium", "high"], default: "high" },
    medicalCondition: { type: String },
    compatibility: { type: String },


    assignedDonor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      default: null,
    },

    phone: { type: String },
    age: { type: String },
    state: { type: String },
    city: { type: String },
    medicalRecords: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("OrganRequest", organRequestSchema);
