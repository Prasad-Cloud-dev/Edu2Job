const Prediction = require("../models/Prediction");
const runModel = require("../mlmodels/model");
const prepareFeatures = require("../mlmodels/prepareFeatures");

// POST /api/predictions
const createPrediction = async (req, res) => {
  try {
    const { degree, major, cgpa, experience, skills, certifications, industry } = req.body;

    // 1. Validate inputs
    if (!degree || !major || !cgpa || !experience) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Prepare numeric features for ONNX
    const featureArray = prepareFeatures({
      degree,
      major,
      cgpa,
      experience,
      skills,
      certifications,
      industry,
    });

    // 3. Run ONNX model
    const prediction = await runModel(featureArray);

    // 4. Save to MongoDB
    const newPrediction = await Prediction.create({
      user: req.user.id,
      degree,
      major,
      cgpa,
      experience,
      skills,
      certifications,
      industry,
      prediction,
    });

    // 5. Respond to frontend
    res.status(201).json({
      success: true,
      prediction,
      history: newPrediction,
    });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
};

// GET /api/predictions/history
const getPredictions = async (req, res) => {
  try {
    const preds = await Prediction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, history: preds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch predictions" });
  }
};

module.exports = { createPrediction, getPredictions };
