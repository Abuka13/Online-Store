import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthed, role, isPremium } = useAuth();
  return (
    <div className="container">
      <div className="card">
        <h1>Online Store</h1>
        <p className="muted">Auth + RBAC + SMTP + Products + Cart + Orders</p>
        {isAuthed && (
          <div className="row wrap mt">
            <span className="chip">Role: {role}</span>
            {isPremium && <span className="chip">Premium ✅</span>}
          </div>
        )}
        <div className="row wrap mt">
          <Link className="btn" to="/products">Browse Products</Link>
          {!isAuthed && <Link className="btn ghost" to="/login">Login</Link>}
        </div>
      </div>
    </div>
  );
}
