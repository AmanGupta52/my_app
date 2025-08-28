const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Booking = require("../models/Booking"); // 👈 create this model

// Add new booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // ✉️ Send reminder email
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // 👈 store in .env
        pass: process.env.EMAIL_PASS, // 👈 store in .env
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Booking Confirmation",
      text: `Hello ${req.body.fullName},\n\nYour booking with ${req.body.expertName} is confirmed.\nPreferred Timing: ${req.body.timingFrom} to ${req.body.timingTo}\n\nThank you.`,
    });

    res.status(201).json({ message: "Booking confirmed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error booking session" });
  }
});

module.exports = router;
