// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login
  const login = (userData) => {
    const newUser = {
      fullName: userData.fullName || "User", // ✅ safe fallback
      age: userData.age || null,
      email: userData.email,
      token: userData.token || null,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
