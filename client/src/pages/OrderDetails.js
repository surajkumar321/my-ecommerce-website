// client/src/pages/OrderDetails.js
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

const money = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

export default function OrderDetails() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setO(data);
        setMsg("");
      } catch (e) {
        setMsg(e.response?.data?.message || e.message);
      }
    })();
  }, [id]);

  const totals = useMemo(() => {
    if (!o) return { items: 0, ship: 0, tax: 0, total: 0 };
    return {
      items: Number(o.itemsPrice || 0),
      ship: Number(o.shippingPrice || 0),
      tax: Number(o.taxPrice || 0),
      total: Number(o.totalPrice || 0),
    };
  }, [o]);

  if (!o) {
    return <div className="container">{msg ? <p style={{color:"crimson"}}>{msg}</p> : <p>Loading…</p>}</div>;
  }

  const items = Array.isArray(o.orderItems) ? o.orderItems : [];

  return (
    <div className="container">
      <h2>Order <span className="order-id">{o._id}</span></h2>

      <div className="od-grid">
        {/* LEFT COLUMN */}
        <div>
          <div className="card od-card">
            <div style={{ display: "grid", gap: 6 }}>
              <div><b>Status:</b> {o.status || "-"}</div>
              <div><b>Placed on:</b> {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</div>
              <div><b>User:</b> {o.user?.name} &lt;{o.user?.email}&gt;</div>
            </div>

            <h3 style={{ marginTop: 14 }}>Shipping Address</h3>
            <div style={{ color: "#374151" }}>
              {o.shippingAddress?.fullName}<br />
              {o.shippingAddress?.phone}<br />
              {o.shippingAddress?.pincode}<br />
              {o.shippingAddress?.line1 || o.shippingAddress?.address}<br />
              {o.shippingAddress?.line2 || o.shippingAddress?.area}<br />
              {o.shippingAddress?.city}, {o.shippingAddress?.state}
            </div>

            <h3 style={{ marginTop: 14 }}>Items</h3>
            <div className="table-wrap">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <Th align="left">Product</Th>
                    <Th>Price</Th>
                    <Th>Qty</Th>
                    <Th>Subtotal</Th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                      <Td align="left">
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <img
                            src={it.imageUrl || "/placeholder.png"}
                            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                            alt={it.name}
                            style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" }}
                          />
                          <div>{it.name}</div>
                        </div>
                      </Td>
                      <Td>{money(it.price)}</Td>
                      <Td>{it.qty}</Td>
                      <Td>{money((it.price || 0) * (it.qty || 0))}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Link to="/my-orders" style={{ display: "inline-block", marginTop: 12 }}>
            ← Back to My Orders
          </Link>
        </div>

        {/* RIGHT COLUMN (Summary) */}
        <div className="card od-summary">
          <h3>Order Summary</h3>
          <Row label="Items total:" value={money(totals.items)} />
          <Row label="Shipping:" value={money(totals.ship)} />
          <Row label="Tax:" value={money(totals.tax)} />
          <hr />
          <Row label={<b>Grand Total:</b>} value={<b>{money(totals.total)}</b>} />
        </div>
      </div>
    </div>
  );
}

const Th = ({ children, align = "center" }) => (
  <th style={{ textAlign: align, padding: "10px 8px", color: "#6b7280", fontSize: 14 }}>{children}</th>
);
const Td = ({ children, align = "center" }) => (
  <td style={{ textAlign: align, padding: "10px 8px" }}>{children}</td>
);
const Row = ({ label, value }) => (
  <div className="row">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);
