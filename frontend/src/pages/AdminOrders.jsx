import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { money } from "../utils/format";

export default function AdminOrders() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);

  async function load() {
    setErr("");
    try {
      setBusy(true);
      const res = await api.get("/api/orders/all/list");
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
      <h2>Admin/Moderator Orders</h2>
      <p className="muted">Only admin or moderator can view this page.</p>

      {err && <div className="alert">{err}</div>}
      {busy ? <p>Loading...</p> : (
        <div className="card">
          <div className="list">
            {items.map(o => (
              <Link key={o._id} className="list-row linkrow" to={`/orders/${o._id}`}>
                <div style={{flex:1}}>
                  <strong>Order #{o._id.slice(-6)}</strong>
                  <div className="muted small">
                    {o.user?.name} ({o.user?.email}) · {o.status}
                  </div>
                </div>
                <span className="chip">{money(o.totalPrice)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
