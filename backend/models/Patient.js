import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    age: { type: String, required: true },
    phone: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    requiredOrgan: { type: String, required: true },
    medicalCondition: { type: String },
    state: { type: String },
    city: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
