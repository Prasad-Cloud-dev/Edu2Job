const mongoose = require("mongoose");

const PredictionHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you have a User model
      required: true,
    },
    inputData: {
      type: Object, // store the full input features
      required: true,
    },
    predictedRole: {
      type: String,
      required: true,
    },
    probabilities: {
      type: Object, // optional: store top-3 or full probability distribution
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PredictionHistory", PredictionHistorySchema);
