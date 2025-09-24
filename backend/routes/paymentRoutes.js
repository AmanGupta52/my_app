// backend/routes/paymentRoutes.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking"); // Mongoose model
const router = express.Router();
require("dotenv").config();

console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Secret:", process.env.RAZORPAY_SECRET);

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 👉 Create Order
router.post("/order", async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: "Unable to create order" });
  }
});

// 👉 Verify Payment & Save Booking
router.post("/verify", async (req, res) => {
  try {
    const { paymentResponse, booking } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResponse;

    // ✅ Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Save booking in DB
    const newBooking = await Booking.create({
      ...booking,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "Paid",
      createdAt: new Date(),
    });

    res.json({ success: true, message: "Payment verified and booking created", booking: newBooking });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;
