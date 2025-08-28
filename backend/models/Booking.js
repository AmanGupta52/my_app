const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  issue: { type: String, required: true },
  timingFrom: { type: String, required: true },
  timingTo: { type: String, required: true },
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: "Expert", required: true },
  expertName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
