// src/components/LoginModal.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./LoginModal.module.css";

const LoginModal = ({ onClose }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState("user"); // user, admin, moderator
  const [forgotPassword, setForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    password: "",
    otp: "",
    role: "user",
    newPassword: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage({ type: "error", text: "Please enter your email first." });
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
      });
      setMessage({ type: "success", text: res.data.message });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send OTP.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { fullName, age, email, password, otp, role, newPassword } = formData;

    try {
      let endpoint = "";
      let payload = {};

      if (forgotPassword) {
        if (!email || !otp || !newPassword) {
          setMessage({
            type: "error",
            text: "Email, OTP, and new password required.",
          });
          setLoading(false);
          return;
        }
        endpoint = "/reset-password";
        payload = { email, otp, newPassword };
      } else if (isLogin) {
        if (!email || !password) {
          setMessage({ type: "error", text: "Email and password required." });
          setLoading(false);
          return;
        }
        endpoint = "/login";
        payload = { email, password, role: loginRole };
      } else {
        if (!fullName || !age || !otp || !password) {
          setMessage({
            type: "error",
            text: "Full name, age, password and OTP required.",
          });
          setLoading(false);
          return;
        }
        endpoint = "/register";
        payload = { fullName, age, email, password, otp, role: "user" };
      }

      const res = await axios.post(
        `http://localhost:5000/api/auth${endpoint}`,
        payload
      );

      setMessage({ type: "success", text: res.data.message || "Success!" });

      if (isLogin && res.data.token) {
        await login(email, password);
      }

      // Redirect
      if (res.data.user?.role === "admin") navigate("/admin-dashboard");
      else if (res.data.user?.role === "moderator")
        navigate("/moderator-dashboard");
      else navigate("/");

      onClose();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authOverlay}>
      <div className={`${styles.authCard} ${styles.glassmorphism}`}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {forgotPassword
            ? "Reset Password"
            : isLogin
            ? `Login as ${loginRole}`
            : "Register (User)"}
        </h2>

        {isLogin && !forgotPassword && (
          <div className={`${styles.dFlex} justify-content-center mb-3`}>
            {["user", "moderator", "admin"].map((r) => (
              <button
                key={r}
                className={`btn me-2 ${
                  loginRole === r ? "btn-warning" : "btn-outline-warning"
                }`}
                onClick={() => setLoginRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        )}

        {message && (
          <div
            className={`${styles.alert} ${
              message.type === "error" ? styles.alertDanger : styles.alertSuccess
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && !forgotPassword && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className={`${styles.glassInput} mb-3`}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className={`${styles.glassInput} mb-3`}
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.glassInput} mb-3`}
          />

          {!forgotPassword && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.glassInput} mb-3`}
            />
          )}

          {forgotPassword && (
            <>
              <div className={`${styles.dFlex} mb-3`}>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className={`${styles.glassInput} me-2`}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="btn btn-primary"
                >
                  Send OTP
                </button>
              </div>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className={`${styles.glassInput} mb-3`}
              />
            </>
          )}

          {!isLogin && !forgotPassword && (
            <div className={`${styles.dFlex} mb-3`}>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className={`${styles.glassInput} me-2`}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="btn btn-primary"
              >
                Send OTP
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-warning w-100 mb-3"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : forgotPassword ? (
              "Reset Password"
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center mt-3">
          {forgotPassword ? (
            <span
              className={styles.toggleLink}
              onClick={() => setForgotPassword(false)}
            >
              Back to Login
            </span>
          ) : isLogin ? (
            <>
              Don’t have an account?{" "}
              <span
                className={styles.toggleLink}
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
              <br />
              <span
                className={`${styles.toggleLink} text-danger`}
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className={styles.toggleLink}
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
