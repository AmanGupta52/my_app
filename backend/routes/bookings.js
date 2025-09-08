// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Booking = require("../models/Booking");
const Expert = require("../models/Expert");

// Setup reusable mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================= USER BOOKINGS =======================

// Create booking (User request)
router.post("/", async (req, res) => {
  try {
    const { fullName, email, age, issue, timingFrom, timingTo, expertId } = req.body;

    if (!fullName || !email || !issue || !timingFrom || !timingTo || !expertId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Automatically fetch expertName from Expert collection
    const expert = await Expert.findById(expertId);
    if (!expert) return res.status(404).json({ message: "Expert not found" });

    const bookingData = {
      fullName,
      email,
      age,
      issue,
      timingFrom,
      timingTo,
      expertId: expert._id,
      expertName: expert.fullName,
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "📅 Booking Request Received",
      html: `
        <h2>Hello ${fullName},</h2>
        <p>Your booking with <strong>${expert.fullName}</strong> has been received.</p>
        <p><b>Preferred Timing:</b> ${timingFrom} - ${timingTo}</p>
        <p>We will notify you once the expert confirms.</p>
        <br/>
        <p>Thank you,<br/>Believe Consultancy Team</p>
      `,
    });

    res.status(201).json({ message: "Booking created, awaiting expert confirmation", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating booking" });
  }
});

// Expert/Moderator updates status, meeting link, or notes
router.put("/:id", async (req, res) => {
  try {
    const { status, meetingLink, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (meetingLink) updateData.meetingLink = meetingLink;
    if (notes) updateData.notes = notes;

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ✅ Send notification when any of status, meetingLink, or notes are updated
    if (status || meetingLink || notes) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: `📢 Booking Update`,
        html: `
          <h2>Hello ${booking.fullName},</h2>
          <p>Your booking with <strong>${booking.expertName}</strong> has been updated.</p>
          <p><b>Status:</b> ${booking.status}</p>
          ${meetingLink ? `<p><b>Meeting Link:</b> <a href="${meetingLink}" target="_blank">${meetingLink}</a></p>` : "<p>Meeting link will be shared later.</p>"}
          ${notes ? `<p><b>Notes:</b> ${notes}</p>` : ""}
          <br/>
          <p>Thank you,<br/>Believe Consultancy Team</p>
        `,
      });
    }

    res.json({ message: "Booking updated & user notified", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating booking" });
  }
});

// Fetch all bookings of a user by email
router.get("/user/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});

// Fetch single booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking" });
  }
});

// Fetch all bookings (Moderator view)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all bookings" });
  }
});

// Cancel booking (User request)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: deleted.email,
      subject: "❌ Booking Cancelled",
      html: `
        <h2>Hello ${deleted.fullName},</h2>
        <p>Your booking with <strong>${deleted.expertName}</strong> has been <b>cancelled</b>.</p>
        <br/>
        <p>Thank you,<br/>Believe Consultancy Team</p>
      `,
    });

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

module.exports = router;
