const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

// GET all feedback
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new feedback
router.post("/", async (req, res) => {
  try {
    const { fullName, email, stars, title, message } = req.body;

    const feedback = new Feedback({
      fullName: fullName || "Anonymous",
      email: email || "Not Provided",
      stars,
      title,
      message,
    });

    const saved = await feedback.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
