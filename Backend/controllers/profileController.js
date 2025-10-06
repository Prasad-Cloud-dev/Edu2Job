const Profile = require("../models/Profile");
const Prediction = require("../models/Prediction");

// Create or Update (Upsert)
const upsertProfile = async (req, res) => {
  try {
    const { degree, university, cgpa, skills, yearOfPassing } = req.body;

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile.degree = degree || profile.degree;
      profile.university = university || profile.university;
      profile.cgpa = cgpa || profile.cgpa;
      profile.skills = skills || profile.skills;
      profile.yearOfPassing = yearOfPassing || profile.yearOfPassing;
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile({
        user: req.user.id,
        degree,
        university,
        cgpa,
        skills,
        yearOfPassing,
      });
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate("user", "username email");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Count predictions
    const predictionCount = await Prediction.countDocuments({ user: req.user.id });

    res.json({
      ...profile.toObject(),
      predictionCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile (PUT)
const updateProfile = async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Profile not found" });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  try {
    const deleted = await Profile.findOneAndDelete({ user: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Profile not found" });

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { upsertProfile, getProfile, updateProfile, deleteProfile };
