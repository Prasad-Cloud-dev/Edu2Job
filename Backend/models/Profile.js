const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // linked with User schema
      required: true,
      unique: true,
    },
    degree: { type: String, required: true },
    university: { type: String, required: true },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    skills: { type: [String], required: true },
    yearOfPassing: { type: Number, required: true },
    specialization: { type: String },
    location: { type: String },
    predictionCount: { type: Number, default: 0 } // ✅ added this
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
