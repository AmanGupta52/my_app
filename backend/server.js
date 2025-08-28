const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// ✅ Expert routes
app.use('/api/experts', require('./routes/expertRoutes'));

// ✅ Booking routes
app.use('/api/bookings', require('./routes/bookings')); 
 
//feedback routes
app.use("/api/feedback",  require('./routes/feedbackRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
