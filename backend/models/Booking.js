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

  status: { type: String, enum: ["pending", "accepted", "rejected", "completed"], default: "pending" },
  meetingLink: { type: String, default: "" },
  notes: { type: String, default: "" }, // Admin/expert notes
   reminderSent: { type: Boolean, default: false }, // Track reminder status
}, { timestamps: true }); // <-- Auto-manages createdAt & updatedAt


bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
