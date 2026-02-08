import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthed, user, role, isAdmin, isModerator, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" to="/">Online Store</Link>

        <nav className="links">
          <NavLink to="/products">Products</NavLink>
          {isAuthed && <NavLink to="/cart">Cart</NavLink>}
          {isAuthed && <NavLink to="/orders">My Orders</NavLink>}
          {(isAdmin || isModerator) && <NavLink to="/admin/orders">Admin Orders</NavLink>}
        </nav>

        <div className="right">
          {!isAuthed ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink className="btn small" to="/register">Register</NavLink>
            </>
          ) : (
            <>
              <span className="chip">{user?.name} · {role}</span>
              <NavLink className="btn small" to="/profile">Profile</NavLink>
              <button className="btn small danger" onClick={() => { logout(); nav("/login"); }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
