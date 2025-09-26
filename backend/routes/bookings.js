  // routes/bookings.js
  const express = require("express");
  const router = express.Router();
  const Booking = require("../models/Booking");
  const Expert = require("../models/Expert");

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

      res.status(201).json({ message: "Booking created successfully", booking });
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

      res.json({ message: "Booking updated successfully", booking });
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

      res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error cancelling booking" });
    }
  });

  module.exports = router;