import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { required } from "../utils/validators";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (!token) {
    return (
      <div className="container narrow">
        <div className="card">
          <h2>Reset Password</h2>
          <div className="alert">Invalid reset link. Please request a new one.</div>
          <p className="muted"><Link to="/forgot-password">Request new reset link</Link></p>
        </div>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const e1 = required(password, "Password");
    const e2 = required(confirmPassword, "Confirm Password");
    if (e1 || e2) return setErr(e1 || e2);

    if (password !== confirmPassword) {
      return setErr("Passwords do not match");
    }

    if (password.length < 6) {
      return setErr("Password must be at least 6 characters");
    }

    try {
      setBusy(true);
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password
      });
      setMsg(res.data.message);
      setTimeout(() => nav("/login"), 2000);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to reset password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container narrow">
      <div className="card">
        <h2>Reset Password</h2>
        {err && <div className="alert">{err}</div>}
        {msg && <div className="alert alert-success">{msg}</div>}
        
        {!msg ? (
          <form className="form" onSubmit={onSubmit}>
            <label>New Password
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={busy}
              />
            </label>
            <label>Confirm Password
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                disabled={busy}
              />
            </label>
            <button className="btn" disabled={busy}>
              {busy ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <p className="muted">Redirecting to login...</p>
        )}
        
        <p className="muted"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
}
