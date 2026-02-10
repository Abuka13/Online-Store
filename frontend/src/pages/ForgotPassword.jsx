import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { isValidEmail, required } from "../utils/validators";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const e1 = required(email, "Email") || (!isValidEmail(email) ? "Invalid email" : null);
    if (e1) return setErr(e1);

    try {
      setBusy(true);
      const res = await api.post("/api/auth/forgot-password", { email });
      setMsg(res.data.message);
      setEmail("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to send reset email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container narrow">
      <div className="card">
        <h2>Forgot Password</h2>
        {err && <div className="alert">{err}</div>}
        {msg && <div className="alert alert-success">{msg}</div>}
        
        {!msg ? (
          <>
            <p className="muted">Enter your email address and we'll send you a link to reset your password.</p>
            <form className="form" onSubmit={onSubmit}>
              <label>Email
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={busy}
                />
              </label>
              <button className="btn" disabled={busy}>
                {busy ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div>
            <p>Check your email for the password reset link.</p>
            <p className="muted">The link will expire in 1 hour.</p>
          </div>
        )}
        
        <p className="muted"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
}
