const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Expert = require("../models/Expert");
const Admin = require("../models/Admin");
const Feedback = require("../models/Feedback");
const Booking = require("../models/Booking");
const { authMiddleware, verifyAdmin } = require("../middleware/authMiddleware"); // ✅ fixed import
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");



const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");

// Multer memory storage for image buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ==================== STATS ====================
router.get("/stats", authMiddleware(["admin"]), async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const adminsCount = await Admin.countDocuments();
    const expertsCount = await Expert.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    res.json({ usersCount, adminsCount, expertsCount, feedbackCount, bookingsCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// ==================== Admin ====================

// ============================
// 🔑 Generate OTP
// ============================
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Configure mailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 👉 GET all admins (admin-only)
 */
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select("-password -otp");
    res.json({ admins });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
});



/**
 * 👉 ADD new admin (OTP required in same step)
 */
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { fullName, email, password, otp } = req.body;

    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    // ✅ If no OTP provided → generate and send OTP to other admins
    if (!otp) {
      const generatedOtp = generateOTP();

      // Temporarily store pending admin in memory (better: Redis or DB)
      global.pendingAdmin = {
        fullName,
        email,
        password,
        otp: generatedOtp,
      };

      // Send OTP to other admins
      const otherAdmins = await Admin.find();
      for (const admin of otherAdmins) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: "🔐 New Admin Approval Required",
            text: `Hello ${admin.fullName},\n\nA new admin (${fullName}) is being added.\nYour OTP is: ${generatedOtp}\n\nUse this OTP to approve.`,
          });
        } catch (err) {
          console.error(`Failed to send email to ${admin.email}:`, err.message);
        }
      }

      return res.json({
        message: "OTP sent to existing admins. Please enter it to continue.",
      });
    }

    // ✅ If OTP provided → validate
    if (!global.pendingAdmin || global.pendingAdmin.email !== email) {
      return res.status(400).json({ message: "No pending admin request found." });
    }

    if (otp !== global.pendingAdmin.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ OTP is valid → create admin
    const hashedPassword = await bcrypt.hash(global.pendingAdmin.password, 10);
    const newAdmin = new Admin({
      fullName: global.pendingAdmin.fullName,
      email: global.pendingAdmin.email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    // clear pending
    global.pendingAdmin = null;

    res.status(201).json({
      message: "✅ Admin added successfully after OTP verification.",
      admin: { ...newAdmin._doc, password: undefined },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding admin", error: error.message });
  }
});


/**
 * 👉 UPDATE admin
 */
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        select: "-password -otp",
      }
    );

    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "✅ Admin updated", admin: updatedAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating admin", error: error.message });
  }
});

/**
 * 👉 DELETE admin
 */
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id).select(
      "-password -otp"
    );
    if (!deletedAdmin)
      return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "🗑️ Admin deleted", admin: deletedAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
});

/**
 * 👉 LOGIN admin
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "✅ Login successful",
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
});



// ==================== USERS ====================

// 📌 View all users (admin only)
router.get("/users", authMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// 📌 Add new user (admin only)
router.post("/users", authMiddleware(["admin"]), async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const { password, ...safeUser } = user.toObject();

    res.status(201).json({
      message: "User added successfully",
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding user", error: err.message });
  }
});

// 📌 Update user (admin only)
router.put("/users/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});

// 📌 Delete user (admin only)
router.delete("/users/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User '${deleted.fullName}' deleted successfully`,
      userId: deleted._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

// ==================== MODERATORS ====================

// GET all moderators
router.get("/moderators", authMiddleware(["admin"]), async (req, res) => {
  try {
    const moderators = await Expert.find({ role: "moderator" });
    res.json(moderators);
  } catch (err) {
    res.status(500).json({ message: "Error fetching moderators", error: err.message });
  }
});

// ADD moderator
router.post("/moderators", authMiddleware(["admin"]), upload.single("img"), async (req, res) => {
  try {
    const { fullName, email, password, title, availability, specialities, languages, time, experience } = req.body;

    const existingUser = await Expert.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newModerator = new Expert({
      expertId: uuidv4(), // must generate unique id
      fullName,
      email,
      password: hashedPassword,
      title,
      availability,
      time,
      experience,
      specialities: Array.isArray(specialities) ? specialities : (specialities ? specialities.split(",").map(s => s.trim()) : []),
      languages: Array.isArray(languages) ? languages : (languages ? languages.split(",").map(l => l.trim()) : []),
      role: "moderator"
    });

    // Extra safety
    if (!newModerator.expertId) newModerator.expertId = uuidv4();

    if (req.file) {
      newModerator.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    console.log("UUID:", uuidv4());

    await newModerator.save();
    res.status(201).json({ message: "Moderator added successfully", moderator: newModerator });
  } catch (err) {
    console.error("Error adding moderator:", err);
    res.status(500).json({ message: "Failed to add moderator", error: err.message, stack: err.stack });
  }
});

// UPDATE moderator
router.put("/moderators/:id", authMiddleware(["admin"]), upload.single("img"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.img = { data: req.file.buffer, contentType: req.file.mimetype };
    }
    if (updateData.specialities) updateData.specialities = updateData.specialities.split(",").map(s => s.trim());
    if (updateData.languages) updateData.languages = updateData.languages.split(",").map(l => l.trim());
    if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);

    const updatedModerator = await Expert.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updatedModerator) return res.status(404).json({ message: "Moderator not found" });
    res.json(updatedModerator);
  } catch (err) {
    res.status(500).json({ message: "Error updating moderator", error: err.message });
  }
});

// DELETE moderator
router.delete("/moderators/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const deleted = await Expert.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Moderator not found" });
    res.json({ message: "Moderator deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting moderator", error: err.message });
  }
});

//@desc Get all feedbacks
// @route GET /api/admin/feedbacks
// @access Admin
router.get("/feedbacks", authMiddleware(["admin"]), async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedback:", err.message);
    res.status(500).json({ message: "Error fetching feedback", error: err.message });
  }
});


// @desc Get single feedback by ID
// @route GET /api/admin/feedbacks/:id
// @access Admin
router.get("/feedbacks/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// @desc Add new feedback
// @route POST /api/admin/feedbacks
// @access Admin
router.post("/feedbacks", authMiddleware(["admin"]), async (req, res) => {
  try {
    const fb = new Feedback(req.body);
    await fb.save();
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: "Error adding feedback" });
  }
});

// @desc Update feedback by ID
// @route PUT /api/admin/feedbacks/:id
// @access Admin
router.put("/feedbacks/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFeedback) return res.status(404).json({ message: "Feedback not found" });
    res.json(updatedFeedback);
  } catch (err) {
    res.status(500).json({ message: "Error updating feedback" });
  }
});

// @desc Delete feedback by ID
// @route DELETE /api/admin/feedbacks/:id
// @access Admin
router.delete("/feedbacks/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting feedback" });
  }
});


// ==================== BOOKINGS ====================



/// Admin: View all bookings
router.get("/bookings", authMiddleware(["admin"]), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("expertId", "fullName email")
      .sort({ createdAt: -1 });

    // ✅ Always return an array
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
});


// Admin: Delete booking
router.delete("/bookings/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booking", error: err.message });
  }
});

// Admin: View single booking status
router.get("/bookings/:id/status", authMiddleware(["admin"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id, "status");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ bookingId: req.params.id, status: booking.status });
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking status", error: err.message });
  }
});

module.exports = router;

/**
 * 👉 GET single admin (admin-only)
 */
router.get("/:id", verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password -otp");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin", error: error.message });
  }
});

module.exports = router;
