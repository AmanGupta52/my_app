const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true }, // user's email

    age: { type: Number, required: true },

    issue: { type: String, required: true },

    // Time range selected by user
    timingFrom: { type: String, required: true },
    timingTo: { type: String, required: true },

    // Reference to expert
    expertId: { type: mongoose.Schema.Types.ObjectId, ref: "Expert", required: true },
    expertName: { type: String, required: true },

    // Booking status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },

    meetingLink: { type: String, default: "" },
    notes: { type: String, default: "" },

    reminderSent: { type: Boolean, default: false },

    // Optional: used for reminders & calendar display
    meetingDate: { type: Date },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
