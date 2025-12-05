const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");


const io = new Server(server, {
    cors: {
        origin: "*",
    },
});



dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Allow bigger JSON requests (must be before routes)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Enable CORS
app.use(cors());

// ✅ Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// ✅ Expert routes
app.use("/api/experts", require("./routes/expertRoutes"));

// ✅ Booking routes
app.use("/api/bookings", require("./routes/bookings"));

// ✅ Feedback routes
app.use("/api/feedback", require("./routes/feedbackRoutes"));

// ✅ Admin routes
app.use("/api/admin", require("./routes/adminRoutes"));

// ✅ Payment routes
app.use("/api/payment", require("./routes/paymentRoutes"));

// ✅ News routes
app.use("/api/news", require("./routes/newsRoutes"));

// ✅ agora route
app.use("/api/agora", require("./routes/videocall"));



// --------------- SOCKET.IO SIGNALING ----------------

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("offer", (data) => {
        socket.to(data.roomId).emit("offer", data.offer);
    });

    socket.on("answer", (data) => {
        socket.to(data.roomId).emit("answer", data.answer);
    });

    socket.on("ice-candidate", (data) => {
        socket.to(data.roomId).emit("ice-candidate", data.candidate);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// ----------- START SERVER -----------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
    console.log(`🚀 Server + Video Call Signaling running on port ${PORT}`)
);
