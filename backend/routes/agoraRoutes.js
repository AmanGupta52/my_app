const express = require("express");
const router = express.Router();
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const Booking = require("../models/Booking");
require("dotenv").config();

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// SECURE TOKEN GENERATION USING EMAIL
router.get("/pair-token", async (req, res) => {
    try {
        const { bookingId, userEmail, userRole } = req.query;

        if (!bookingId || !userEmail) {
            return res.status(400).json({ message: "bookingId and userEmail are required" });
        }

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Make sure allowedUsers exists as an array
        const allowedUsers = Array.isArray(booking.allowedUsers) ? booking.allowedUsers : [];

        // SECURITY CHECK: Only allowed users or moderators can join
        if (!allowedUsers.includes(userEmail) && userRole !== "moderator") {
            return res.status(403).json({ message: "You are not allowed to join this meeting" });
        }

        // Create secure channel name
        const channelName = `meeting-${booking._id}`;
        const uid = req.query.uid || 0;
        const role = RtcRole.PUBLISHER;

        const expireTime = 3600; // 1 hour
        const currentTime = Math.floor(Date.now() / 1000);
        const expiryTimestamp = currentTime + expireTime;

        // Generate token
        const token = RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            channelName,
            uid,
            role,
            expiryTimestamp
        );

        return res.json({
            appId: APP_ID,
            token,
            channelName,
            uid,
            expiry: expiryTimestamp,
        });

    } catch (err) {
        console.error("Token error:", err);
        return res.status(500).json({ message: "Server error generating token" });
    }
});

module.exports = router;
