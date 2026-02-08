import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, required, passwordError } from "../utils/validators";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setOk("");

    const e1 = required(name, "Name");
    const e2 = required(email, "Email") || (!isValidEmail(email) ? "Invalid email" : null);
    const e3 = passwordError(password);
    if (e1 || e2 || e3) return setErr(e1 || e2 || e3);

    try {
      setBusy(true);
      await register(name, email, password);
      setOk("Registered. (Welcome email will be sent if SMTP is configured). Now login.");
      setTimeout(() => nav("/login"), 700);
    } catch (e) {
      setErr(e?.response?.data?.message || "Register failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container narrow">
      <div className="card">
        <h2>Register</h2>
        {err && <div className="alert">{err}</div>}
        {ok && <div className="alert ok">{ok}</div>}
        <form className="form" onSubmit={onSubmit}>
          <label>Name
            <input value={name} onChange={(e)=>setName(e.target.value)} required />
          </label>
          <label>Email
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} minLength={6} required />
          </label>
          <button className="btn" disabled={busy}>{busy ? "Creating..." : "Register"}</button>
        </form>
        <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
