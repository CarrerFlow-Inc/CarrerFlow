import React, { useState, useEffect } from "react";
import { AuthContext } from "./auth-context-definition";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carrerflow_user"));
    } catch {
      return null;
    }
  });
  const [isLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("carrerflow_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("carrerflow_user");
    }
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("carrerflow_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}