const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { AccessToken } = require("livekit-server-sdk");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_SERVER_URL = process.env.LIVEKIT_SERVER_URL;

// Generate Token Function
function generateToken(roomName, identity) {
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity,
        ttl: "2h"
    });

    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
    });

    return at.toJwt();
}

// 1️⃣ Create Room Route
app.post("/api/create-room", async (req, res) => {
    const { roomName } = req.body;

    if (!roomName)
        return res.status(400).json({ error: "Room name required" });

    return res.json({
        roomName,
        url: LIVEKIT_SERVER_URL
    });
});

// 2️⃣ Join Room Route
app.post("/api/join-room", (req, res) => {
    const { roomName, userId } = req.body;

    if (!roomName || !userId)
        return res.status(400).json({ error: "roomName and userId required" });

    const token = generateToken(roomName, userId);

    res.json({
        url: LIVEKIT_SERVER_URL,
        token
    });
});

// Server Start
app.listen(5000, () => console.log("LiveKit backend running on port 5000"));
