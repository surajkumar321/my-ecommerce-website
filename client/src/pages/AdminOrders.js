// client/src/pages/AdminOrders.js
import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import ErrorBanner from "../components/ErrorBanner";

const money = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders`, { params: { status } });
      setOrders(Array.isArray(data) ? data : []);
      setMsg("");
    } catch (e) {
      setMsg(e.userMessage || e.response?.data?.message || e.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  const totals = useMemo(() => {
    const count = orders.length;
    const revenue = orders
      .filter((o) => o.isPaid)
      .reduce((s, o) => s + (Number(o.totalPrice) || 0), 0);
    return { count, revenue };
  }, [orders]);

  const markAsPaid = async (id) => {
    if (!window.confirm("Mark this order as PAID?")) return;
    try {
      await api.put(`/orders/${id}/pay`);
      load();
    } catch (e) {
      setMsg(e.userMessage || e.response?.data?.message || e.message);
    }
  };

  const cancel = async (id) => {
    const reason = prompt("Cancel reason? (optional)") || "";
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.put(`/orders/${id}/cancel`, { note: reason });
      load();
    } catch (e) {
      setMsg(e.userMessage || e.response?.data?.message || e.message);
    }
  };

  const updateStatus = async (id, next) => {
    try {
      await api.put(`/orders/${id}/status`, { status: next });
      load();
    } catch (e) {
      setMsg(e.userMessage || e.response?.data?.message || e.message);
    }
  };

  const view = async (id) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      alert(renderOrderText(data));
    } catch (e) {
      setMsg(e.userMessage || e.response?.data?.message || e.message);
    }
  };

  const nextStatus = (s) => (s === "PROCESSING" ? "SHIPPED" : s === "SHIPPED" ? "DELIVERED" : null);

  return (
    <div className="container" style={{ padding: 16 }}>
      <h2>Admin — Orders</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "8px 0 16px" }}>
        <label>Status filter:&nbsp;</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">ALL</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="PAID">PAID</option>
        </select>
        <button onClick={load} style={btn()}>Refresh</button>
        <div style={{ marginLeft: "auto", color: "#374151" }}>
          Orders: <strong>{totals.count}</strong> • Revenue: <strong>{money(totals.revenue)}</strong>
        </div>
      </div>

      {!!msg && <ErrorBanner message={msg} />}

      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Date</Th>
                <Th align="left">User</Th>
                <Th>Total</Th>
                <Th>Paid</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const next = nextStatus(o.status);
                return (
                  <tr key={o._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <Td>{o._id.slice(-6)}</Td>
                    <Td>{fmt(o.createdAt)}</Td>
                    <Td align="left">
                      <div style={{ lineHeight: 1.2 }}>
                        <div style={{ fontWeight: 600 }}>{o.user?.name || "-"}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{o.user?.email || ""}</div>
                      </div>
                    </Td>
                    <Td>{money(o.totalPrice)}</Td>
                    <Td>{o.isPaid ? "Yes" : "No"}</Td>
                    <Td>{o.status || "-"}</Td>
                    <Td>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button onClick={() => view(o._id)} style={btn("gray")}>View</button>
                        {next && (
                          <button onClick={() => updateStatus(o._id, next)} style={btn("blue")}>
                            Mark {next}
                          </button>
                        )}
                        <button onClick={() => cancel(o._id)} style={btn("red")} disabled={o.status === "CANCELLED"}>
                          Cancel
                        </button>
                        <button onClick={() => markAsPaid(o._id)} style={btn()} disabled={o.isPaid}
                          title={o.isPaid ? "Already paid" : ""}>
                          Mark Paid
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Th = ({ children, align = "center" }) => (
  <th style={{ textAlign: align, fontSize: 14, color: "#6b7280", padding: "10px 8px" }}>{children}</th>
);
const Td = ({ children, align = "center" }) => (
  <td style={{ textAlign: align, padding: "12px 8px", verticalAlign: "top" }}>{children}</td>
);
const btn = (type = "dark") => {
  const bg = type === "red" ? "#dc2626" : type === "blue" ? "#2563eb" : type === "gray" ? "#374151" : "#111827";
  return { padding: "6px 10px", borderRadius: 8, border: 0, color: "#fff", background: bg, cursor: "pointer" };
};
const fmt = (d) => (d ? new Date(d).toLocaleString() : "-");

function renderOrderText(o) {
  const items = Array.isArray(o.orderItems) ? o.orderItems : (o.items || []);
  const addr = o.shippingAddress || {};
  return [
    `Order ${o._id}`,
    `User: ${o.user?.name || ""} <${o.user?.email || ""}>`,
    `Total: ${money(o.totalPrice)} • Paid: ${o.isPaid ? "Yes" : "No"} • Status: ${o.status}`,
    "",
    "Items:",
    ...items.map((it, i) => `${i + 1}. ${it.name} x ${it.qty} = ${money((it.qty || 0) * (it.price || 0))}`),
    "",
    "Address:",
    `${addr.fullName || ""}`,
    `${addr.phone || ""}`,
    `${addr.pincode || ""}`,
    `${addr.line1 || ""}`,
    `${addr.line2 || ""}`,
    `${addr.city || ""}`,
    `${addr.state || ""}`,
  ].join("\n");
}
