import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({ fullName: "", age: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Fetch profile safely
  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        if (data && data.fullName) {
          setFormData({
            fullName: data.fullName || "",
            age: data.age || "",
            email: data.email || "",
          });
        } else {
          setMessage("❌ Failed to load profile data");
          setIsError(true);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setIsError(true);
        setMessage(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!token) {
      setMessage("❌ Not authorized");
      setIsError(true);
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { fullName: formData.fullName, age: formData.age },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.user) {
        setFormData({
          fullName: res.data.user.fullName,
          age: res.data.user.age,
          email: res.data.user.email,
        });
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage("❌ Failed to update profile");
        setIsError(true);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setIsError(true);
      setMessage(err.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;
  if (!user) return <p className="text-center mt-5">Please login to view profile.</p>;

  return (
    <div
      className="d-flex flex-column align-items-center py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "#fff",
      }}
    >
      <div
        className="p-5 rounded-4 shadow-lg"
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(15px)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <div className="text-center mb-4">
          <FaUserCircle size={80} />
          <h2 className="mt-2">My Profile</h2>
        </div>

        {message && (
          <div
            className={`alert ${
              isError ? "alert-danger" : "alert-success"
            } text-center`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-control"
              required
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="form-control"
              required
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="form-group">
            <label>Email (read-only)</label>
            <input
              type="email"
              value={formData.email}
              className="form-control"
              disabled
              style={{ borderRadius: "10px" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold"
            style={{ borderRadius: "12px", transition: "0.3s" }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Update Profile
          </button>
        </form>

        <button
          className="btn btn-outline-light w-100 mt-3"
          onClick={logout}
          style={{ borderRadius: "12px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
