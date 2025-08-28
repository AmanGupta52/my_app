// src/components/LoginModal.js
import React, { useState, useContext } from "react";
import "./LoginModal.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function LoginModal({ onClose }) {
  const { login } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendOTP = async () => {
    if (!formData.email) {
      return setMessage({ type: "error", text: "Enter your email first." });
    }
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
      });
      setMessage({
        type: "success",
        text: res.data.message || "OTP sent to your email.",
      });
      setOtpSent(true);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { fullName, email, password, age, otp } = formData;

    if (!email || !password || (!isLogin && (!fullName || !age || !otp))) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/login" : "/register";

      const payload = isLogin
        ? { email, password }
        : { fullName, age, email, password, otp };

      const res = await axios.post(
        `http://localhost:5000/api/auth${endpoint}`,
        payload
      );

      setMessage({ type: "success", text: res.data.message || "Success!" });

      // reset form
      setFormData({ fullName: "", age: "", email: "", password: "", otp: "" });

      // update AuthContext and close modal
      login(res.data.user || { email });
      onClose();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card glassmorphism">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2 className="text-center mb-3">{isLogin ? "Sign In" : "Sign Up"}</h2>

        <p className="text-center text-muted mb-4">
          {isLogin
            ? "Enter your credentials to continue"
            : "Fill the form to create your account"}
        </p>

        {message && (
          <div
            className={`alert ${
              message.type === "error" ? "alert-danger" : "alert-success"
            } py-2`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="form-control glass-input mb-3"
                value={formData.fullName}
                onChange={handleChange}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                className="form-control glass-input mb-3"
                value={formData.age}
                onChange={handleChange}
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="form-control glass-input mb-3"
            value={formData.email}
            onChange={handleChange}
          />

          {!isLogin && (
            <div className="d-flex justify-content-between mb-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={sendOTP}
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : otpSent
                  ? "Resend OTP"
                  : "Send OTP"}
              </button>
            </div>
          )}

          {!isLogin && otpSent && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="form-control glass-input mb-3"
              value={formData.otp}
              onChange={handleChange}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control glass-input mb-3"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-warning w-100"
            disabled={loading}
          >
            {loading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              ></div>
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="toggle-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setOtpSent(false);
              setMessage(null);
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
