// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE;

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null); 

  // ✅ Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // ✅ Login (NO role sent anymore)
  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);

      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      if (!res.data?.token) {
        throw new Error("Invalid login response: No token received");
      }

      const newUser = {
        fullName:
          res.data.user?.fullName || res.data.fullName || email.split("@")[0],
        email: res.data.user?.email || res.data.email || email,
        age: res.data.user?.age || res.data.age || null,
        role: res.data.user?.role || res.data.role || "user", // ✅ role comes from backend now
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", res.data.token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(newUser);
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      setAuthError(error.response?.data?.message || error.message || "Login failed");
      return false;
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        authError,
        loading,
        isModerator: user?.role === "moderator",
        isExpert: user?.role === "expert",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
