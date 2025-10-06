const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  degree: String,
  major: String,
  cgpa: Number,
  experience: Number,
  skills: [String],
  certifications: String,
  prediction: String
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
