const nodemailer = require("nodemailer");

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Gmail SMTP
async function sendOtpEmail(toEmail, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Believe Consultancy" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP for Signup",
    html: `
      <h2>OTP Verification</h2>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>Do not share it. This OTP is valid for 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { generateOTP, sendOtpEmail };
