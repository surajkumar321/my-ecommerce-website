import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api";
import ErrorBanner from "../components/ErrorBanner";

export default function MyOrders() {
  const { user } = useSelector((s) => s.auth);
  const nav = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) { nav("/login?redirect=/my-orders"); return; }
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/orders/mine");
        setOrders(Array.isArray(data) ? data : []);
        setMsg("");
      } catch (e) {
        setMsg(e.userMessage || e.response?.data?.message || e.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, nav]);

  if (loading) {
    return (<div className="container"><h2>My Orders</h2><p>Loading…</p></div>);
  }

  return (
    <div className="container">
      <h2>My Orders</h2>
      {!!msg && <ErrorBanner message={msg} />}

      {(!orders || orders.length === 0) ? (
        <p>No orders yet.</p>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                <Th>ID</Th>
                <Th>Date</Th>
                <Th>Total</Th>
                <Th>Items</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const itemsLen = Array.isArray(o?.orderItems) ? o.orderItems.length : 0;
                const created = o?.createdAt ? new Date(o.createdAt).toLocaleString() : "-";
                const total = typeof o?.totalPrice === "number" ? o.totalPrice : 0;

                return (
                  <tr key={o?._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <Td title={o?._id}>{o?._id?.slice(-6) || "-"}</Td>
                    <Td>{created}</Td>
                    <Td>₹{total}</Td>
                    <Td>{itemsLen}</Td>
                    <Td>{o?.status || "-"}</Td>
                    <Td>{o?._id ? <Link to={`/order/${o._id}`}>View</Link> : "-"}</Td>
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
const Th = ({ children }) => (<th style={{ textAlign: "left", padding: 10, color: "#6b7280" }}>{children}</th>);
const Td = ({ children, title }) => (<td style={{ padding: 10, borderTop: "1px solid #eee" }} title={title}>{children}</td>);
