import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!token) return;
        const res = await api.get("/users/profile");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    })();

    if (!token) setLoading(false);
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthed: !!token,
    role: user?.role || "guest",
    isAdmin: user?.role === "admin",
    isModerator: user?.role === "moderator",
    isPremium: user?.role === "premium",

    async login(email, password) {
      const res = await api.post("/auth/login", { email, password });
      const { token: jwt, user: u } = res.data;
      setToken(jwt);
      setUser(u);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(u));
    },

    async register(name, email, password) {
      await api.post("/auth/register", { name, email, password });
    },

    async updateProfile(payload) {
      const res = await api.put("/users/profile", payload);
      const u = res.data?.user;
      if (u) {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      }
    },

    logout() {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
