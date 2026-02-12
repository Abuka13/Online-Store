import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils/format";

export default function ProductDetails() {
  const { id } = useParams();
  const { isAuthed, isAdmin } = useAuth();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setErr(""); setMsg("");
    try {
      const res = await api.get(`/products/${id}`);
      setP(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load");
    }
  }
  useEffect(() => { load(); }, [id]);

  async function addToCart() {
    setErr(""); setMsg("");
    if (!isAuthed) return setErr("Login to add to cart");
    try {
      await api.post("/cart/add", { productId: id, quantity: 1 });
      setMsg("Added to cart ✅");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    }
  }

  async function deleteProduct() {
    if (!isAdmin) return;
    if (!confirm("Delete product?")) return;
    try {
      await api.delete(`/products/${id}`);
      window.location.href = "/products";
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="container">
      <div className="row space">
        <Link className="btn ghost" to="/products">← Back</Link>
        <div className="row">
          {isAuthed && isAdmin && <Link className="btn" to={`/admin/products/${id}/edit`}>Edit</Link>}
          {isAuthed && isAdmin && <button className="btn danger" onClick={deleteProduct}>Delete</button>}
        </div>
      </div>

      {err && <div className="alert">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}

      {p && (
        <div className="card">
          <div className="row wrap">
            <div className="thumb" style={{height:240, minWidth:280}}>
              {p.image ? <img src={p.image} alt={p.name} /> : <div className="thumb-ph">No image</div>}
            </div>
            <div style={{flex:1, minWidth:240}}>
              <h2>{p.name}</h2>
              <p className="muted">{p.category}</p>
              <p>{p.description}</p>
              <div className="row space">
                <strong className="price">{money(p.price)}</strong>
                <button className="btn" onClick={addToCart}>Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
