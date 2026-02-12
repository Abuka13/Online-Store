import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { required } from "../utils/validators";

export default function ProductForm({ mode }) {
  const { id } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState("");

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode !== "edit") return;
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data;
        setName(p.name || "");
        setDescription(p.description || "");
        setPrice(String(p.price ?? ""));
        setCategory(p.category || "General");
        setImage(p.image || "");
      } catch (e) {
        setErr(e?.response?.data?.message || "Load failed");
      }
    })();
  }, [mode, id]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const e1 = required(name, "Name");
    if (e1) return setErr(e1);

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      image
    };

    try {
      setBusy(true);
      if (mode === "create") await api.post("/products", payload);
      else await api.put(`/products/${id}`, payload);
      nav("/products");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Save failed (admin only)");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container narrow">
      <div className="row space">
        <Link className="btn ghost" to="/products">← Back</Link>
      </div>
      <div className="card">
        <h2>{mode === "create" ? "Create Product" : "Edit Product"}</h2>
        {err && <div className="alert">{err}</div>}
        <form className="form" onSubmit={onSubmit}>
          <label>Name*
            <input value={name} onChange={(e)=>setName(e.target.value)} required />
          </label>
          <label>Description
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} />
          </label>
          <label>Price*
            <input type="number" min="0" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} required />
          </label>
          <label>Category
            <input value={category} onChange={(e)=>setCategory(e.target.value)} />
          </label>
          <label>Image URL
            <input value={image} onChange={(e)=>setImage(e.target.value)} placeholder="https://..." />
          </label>
          <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
        </form>
      </div>
    </div>
  );
}
