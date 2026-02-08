import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, required, passwordError } from "../utils/validators";

export default function Profile() {
  const { user, role, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setOk("");

    const e1 = required(name, "Name");
    const e2 = required(email, "Email") || (!isValidEmail(email) ? "Invalid email" : null);
    const e3 = password ? passwordError(password) : null;
    if (e1 || e2 || e3) return setErr(e1 || e2 || e3);

    const payload = { name, email };
    if (password) payload.password = password;

    try {
      setBusy(true);
      await updateProfile(payload);
      setOk("Profile updated");
      setPassword("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container narrow">
      <div className="card">
        <h2>Profile</h2>
        <div className="row wrap mt">
          <span className="chip">Role: {role}</span>
          <span className="chip">Email: {user?.email}</span>
        </div>

        {err && <div className="alert">{err}</div>}
        {ok && <div className="alert ok">{ok}</div>}

        <form className="form" onSubmit={onSubmit}>
          <label>Name
            <input value={name} onChange={(e)=>setName(e.target.value)} required />
          </label>
          <label>Email
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </label>
          <label>New password (optional)
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </label>
          <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
        </form>
      </div>
    </div>
  );
}
