const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  fullName: { type: String, default: "Anonymous" },
  email: { type: String, default: "Not Provided" },
  stars: { type: Number, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
