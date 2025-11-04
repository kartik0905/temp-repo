import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    organType: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactPhone: { type: String, required: true },
    medicalHistory: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
