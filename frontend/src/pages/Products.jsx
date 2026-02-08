import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils/format";

export default function Products() {
  const { isAuthed, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);

  async function load() {
    setErr("");
    try {
      setBusy(true);
      const res = await api.get("/api/products");
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter(p =>
    (p.name || "").toLowerCase().includes(q.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container">
      <div className="row space">
        <div>
          <h2>Products</h2>
          <p className="muted">Public list. Admin can Create/Edit/Delete.</p>
        </div>
        <div className="row">
          <input className="search" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search..." />
          {isAuthed && isAdmin && <Link className="btn" to="/admin/products/new">+ New</Link>}
        </div>
      </div>

      {err && <div className="alert">{err}</div>}
      {busy ? <p>Loading...</p> : (
        <div className="grid">
          {filtered.map(p => (
            <Link key={p._id} to={`/products/${p._id}`} className="card">
              <div className="thumb">
                {p.image ? <img src={p.image} alt={p.name} /> : <div className="thumb-ph">No image</div>}
              </div>
              <div className="mt">
                <div className="row space">
                  <strong>{p.name}</strong>
                  <span className="price">{money(p.price)}</span>
                </div>
                <div className="muted small">{p.category}</div>
                <div className="muted small">{(p.description || "").slice(0, 80)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
