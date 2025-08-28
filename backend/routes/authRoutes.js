const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateOTP, sendOtpEmail } = require('../utils/sendOtp');

// 📧 Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  const otp = generateOTP();
  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent', otp }); // ⚠️ remove OTP in prod
  } catch (err) {
    console.error('OTP Email Error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// 📝 Register
router.post('/register', async (req, res) => {
  const { fullName, age, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, age, email, password: hashedPassword });

    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json({ message: "Registered successfully", user: safeUser });
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

    const { password: _, ...safeUser } = user.toObject();
    res.status(200).json({ message: "Login successful", user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//logout
module.exports = router;
