import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { money } from "../utils/format";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(true);

  async function load() {
    setErr("");
    try {
      setBusy(true);
      const res = await api.get("/api/cart");
      setCart(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateQty(productId, quantity) {
    try {
      await api.put("/api/cart/update", { productId, quantity });
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    }
  }

  async function remove(productId) {
    try {
      await api.delete(`/api/cart/remove/${productId}`);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Remove failed");
    }
  }

  async function clear() {
    try {
      await api.delete("/api/cart/clear");
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Clear failed");
    }
  }

  async function checkout() {
    try {
      const res = await api.post("/api/orders", {
        shippingAddress: { address: "Demo address", city: "Demo city" },
        paymentMethod: "cash"
      });
      window.location.href = `/orders/${res.data._id}`;
    } catch (e) {
      setErr(e?.response?.data?.message || "Checkout failed");
    }
  }

  const items = cart?.items || [];
  const total = cart?.totalPrice ?? 0;

  return (
    <div className="container">
      <div className="row space">
        <div>
          <h2>Cart</h2>
          <p className="muted">Private endpoint (JWT)</p>
        </div>
        <div className="row">
          <button className="btn danger" onClick={clear} disabled={!items.length}>Clear</button>
          <button className="btn" onClick={checkout} disabled={!items.length}>Checkout</button>
        </div>
      </div>

      {err && <div className="alert">{err}</div>}

      {busy ? <p>Loading...</p> : (
        <div className="card">
          {!items.length ? (
            <p>Cart is empty. <Link to="/products">Go to products</Link></p>
          ) : (
            <>
              <div className="list">
                {items.map((it) => (
                  <div className="list-row" key={it.product?._id || it.product}>
                    <div style={{flex:1}}>
                      <strong>{it.product?.name || "Product"}</strong>
                      <div className="muted small">{money(it.price)} each</div>
                    </div>
                    <div className="row">
                      <input className="qty" type="number" min="1" value={it.quantity}
                        onChange={(e)=>updateQty(it.product?._id || it.product, Number(e.target.value))} />
                      <button className="btn danger small" onClick={()=>remove(it.product?._id || it.product)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row space mt">
                <strong>Total</strong>
                <strong className="price">{money(total)}</strong>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
