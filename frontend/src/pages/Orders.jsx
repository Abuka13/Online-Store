import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { money } from "../utils/format";

export default function Orders() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);

  async function load() {
    setErr("");
    try {
      setBusy(true);
      const res = await api.get("/api/orders");
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <h2>My Orders</h2>
      <p className="muted">Private endpoint (JWT)</p>
      {err && <div className="alert">{err}</div>}

      {busy ? <p>Loading...</p> : (
        <div className="card">
          {!items.length ? <p>No orders yet.</p> : (
            <div className="list">
              {items.map(o => (
                <Link key={o._id} to={`/orders/${o._id}`} className="list-row linkrow">
                  <div style={{flex:1}}>
                    <strong>Order #{o._id.slice(-6)}</strong>
                    <div className="muted small">Status: {o.status} · Paid: {o.isPaid ? "Yes" : "No"}</div>
                  </div>
                  <span className="chip">{money(o.totalPrice)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
