const fetch = global.fetch || require("node-fetch"); // Node 18+ has fetch

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP using Brevo API
async function sendOtpEmail(toEmail, otp) {
  try {
    const body = {
      sender: { name: "Believe Consultancy", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: toEmail }],
      subject: "Your OTP for Signup",
      htmlContent: `
        <h2>OTP Verification</h2>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>Do not share it with anyone. This OTP is valid for 5 minutes.</p>
      `
    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify(body),
    });

    const data = await res.json(); // parse Brevo response
    console.log("Brevo API response:", data);

    if (!res.ok) {
      throw new Error(`Brevo API error ${res.status}: ${data.message || JSON.stringify(data)}`);
    }

  } catch (err) {
    console.error("User OTP Email Error:", err);
    throw err;
  }
}

module.exports = { generateOTP, sendOtpEmail };
