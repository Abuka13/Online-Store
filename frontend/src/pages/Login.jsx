import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, required } from "../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const e1 = required(email, "Email") || (!isValidEmail(email) ? "Invalid email" : null);
    const e2 = required(password, "Password");
    if (e1 || e2) return setErr(e1 || e2);

    try {
      setBusy(true);
      await login(email, password);
      nav("/products");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container narrow">
      <div className="card">
        <h2>Login</h2>
        {err && <div className="alert">{err}</div>}
        <form className="form" onSubmit={onSubmit}>
          <label>Email
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </label>
          <button className="btn" disabled={busy}>{busy ? "Signing in..." : "Login"}</button>
        </form>
        <p className="muted">No account? <Link to="/register">Register</Link></p>
        <p className="muted"><Link to="/forgot-password">Forgot password?</Link></p>
      </div>
    </div>
  );
}
