import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils/format";

export default function OrderDetails() {
  const { id } = useParams();
  const { isAdmin, isModerator } = useAuth();
  const canManage = isAdmin || isModerator;

  const [o, setO] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setErr(""); setMsg("");
    try {
      const res = await api.get(`/api/orders/${id}`);
      setO(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    }
  }

  useEffect(() => { load(); }, [id]);

  async function cancel() {
    setErr(""); setMsg("");
    try {
      const res = await api.delete(`/api/orders/${id}/cancel`);
      setMsg(res.data?.message || "Cancelled");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Cancel failed");
    }
  }

  async function markPaid() {
    setErr(""); setMsg("");
    try {
      await api.put(`/api/orders/${id}/pay`, {});
      setMsg("Marked paid");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    }
  }

  async function setStatus(status) {
    setErr(""); setMsg("");
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      setMsg("Status updated");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    }
  }

  return (
    <div className="container">
      <div className="row space">
        <Link className="btn ghost" to="/orders">← Back</Link>
        <div className="row wrap">
          <button className="btn danger" onClick={cancel}>Cancel</button>
          {canManage && <button className="btn" onClick={markPaid}>Mark paid</button>}
          {canManage && (
            <select onChange={(e)=>setStatus(e.target.value)} defaultValue="">
              <option value="" disabled>Set status</option>
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          )}
        </div>
      </div>

      {err && <div className="alert">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}

      {o && (
        <div className="card">
          <h2>Order #{o._id.slice(-6)}</h2>
          <div className="row wrap mt">
            <span className="chip">Status: {o.status}</span>
            <span className="chip">Paid: {o.isPaid ? "Yes" : "No"}</span>
            <span className="chip">Total: {money(o.totalPrice)}</span>
          </div>

          <h3 className="mt">Items</h3>
          <div className="list">
            {(o.items || []).map((it, idx) => (
              <div className="list-row" key={idx}>
                <div style={{flex:1}}>
                  <strong>{it.name}</strong>
                  <div className="muted small">{it.quantity} × {money(it.price)}</div>
                </div>
                <span className="chip">{money(it.quantity * it.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
