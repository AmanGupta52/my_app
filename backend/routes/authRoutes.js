// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Expert = require("../models/Expert");
const Admin = require("../models/Admin");
const { generateOTP, sendOtpEmail } = require("../utils/sendOtp");
const { authMiddleware } = require("../middleware/authMiddleware");


const router = express.Router();

// =============================
// ENV SECRETS (⚠️ Use .env in production)
// =============================
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// Temporary in-memory OTP storage (⚠️ Use Redis/DB for production)
let otpStore = {};

// =============================
// 📧 SEND USER OTP
// =============================
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = generateOTP();
  otpStore[email] = otp;

  try {
    await sendOtpEmail(email, `Your OTP: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("User OTP Email Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// =============================
// 📝 REGISTER (User Only)
// =============================
router.post("/register", async (req, res) => {
  const { fullName, age, email, password, otp } = req.body;

  try {
    // ✅ Verify OTP
    if (!otp || otpStore[email] !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    delete otpStore[email];

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      age,
      email,
      password: hashedPassword,
      role: "user",
    });

    const { password: _, ...safeUser } = newUser.toObject();
    res.status(201).json({ message: "User registered successfully", user: safeUser });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// 🔐 LOGIN (Auto-detect role)
// =============================
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body; // role optional, for UI clarity

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let user = null;
    let detectedRole = null;

    // Check User
    user = await User.findOne({ email });
    if (user) detectedRole = "user";

    // Check Admin
    if (!user) {
      user = await Admin.findOne({ email });
      if (user) detectedRole = "admin";
    }

    // Check Moderator
    if (!user) {
      user = await Expert.findOne({ email, role: "moderator" });
      if (user) detectedRole = "moderator";
    }

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: detectedRole },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...safeUser } = user.toObject();
    res.status(200).json({
      message: `${detectedRole} login successful`,
      user: safeUser,
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// 🔑 RESET PASSWORD (with OTP)
// =============================
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!otp || otpStore[email] !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    delete otpStore[email];

    let user = await User.findOne({ email });
    if (!user) user = await Admin.findOne({ email });
    if (!user) user = await Expert.findOne({ email, role: "moderator" });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// 🚪 LOGOUT
// =============================
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// =============================
// 🧑 USER PROFILE (Protected)
// =============================

// Get profile (for logged-in user)
router.get("/profile", authMiddleware(["user"]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile (only for user)
router.put("/profile", authMiddleware(["user"]), async (req, res) => {
  try {
    const { fullName, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, age },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
