const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateOTP, sendOtpEmail } = require('../utils/sendOtp'); // ✅ Import OTP utilities

// 📧 Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email required' });

  const otp = generateOTP();

  // Optionally: store OTP in memory, DB, or session here

  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent', otp }); // ⚠️ Remove `otp` in production
  } catch (err) {
    console.error('OTP Email Error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// 📝 Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    // Remove password from the user object before sending it
    const { name, age, email: userEmail } = user;

    res.status(200).json({
      message: "Login successful",
      user: {
        name,
        email: userEmail,
        age
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
