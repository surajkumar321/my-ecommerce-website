import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setProducts(list);
      setMsg("");
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    const base = Array.isArray(products) ? products : [];
    if (!t) return base;
    return base.filter(
      (p) =>
        p?.name?.toLowerCase().includes(t) ||
        p?.category?.toLowerCase().includes(t) ||
        String(p?.price ?? "").includes(t)
    );
  }, [products, q]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const prev = products;
    setProducts((arr) => arr.filter((p) => p._id !== id));
    try {
      await api.delete(`/products/${id}`);
      setMsg("Deleted.");
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
      setProducts(prev);
    }
  };

  const goEdit = (id) => navigate(`/admin/edit/${id}`);

  return (
    <div className="container">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, flex: 1 }}>Admin Dashboard</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/admin/orders">
            <button style={{ padding: "8px 12px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", cursor: "pointer" }}>
              📝 Manage Orders
            </button>
          </Link>
          <Link to="/admin/add">
            <button style={{ padding: "8px 12px", borderRadius: 8, border: 0, background: "#111827", color: "#fff", cursor: "pointer" }}>
              + Add Product
            </button>
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name / category / price…"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <button onClick={load} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
          Refresh
        </button>
      </div>

      {!!msg && <p style={{ color: msg === "Deleted." ? "#065f46" : "#dc2626" }}>{msg}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 16, textAlign: "center" }}>
          <p style={{ margin: "8px 0" }}>No products found.</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Link to="/admin/add">
              <button style={btn("edit")}>Add New Product</button>
            </Link>
            <button onClick={load} style={btn()}>Reload</button>
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Image</Th>
                <Th align="left">Name</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <Td>
                    <img
                      src={p.imageUrl || p.image || "/placeholder.png"}
                      alt={p.name}
                      onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                      style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" }}
                    />
                  </Td>
                  <Td align="left" style={{ fontWeight: 600 }}>{p.name}</Td>
                  <Td>{p.category || "-"}</Td>
                  <Td>₹{p.price}</Td>
                  <Td>{p.stock ?? "-"}</Td>
                  <Td>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => goEdit(p._id)} style={btn("edit")}>Edit</button>
                      <button onClick={() => onDelete(p._id)} style={btn("delete")}>Delete</button>
                    </div>
                  </Td>
                </tr>
              ))}
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
const Td = ({ children, align = "center", style }) => (
  <td style={{ textAlign: align, padding: "12px 8px", ...style }}>{children}</td>
);

const btn = (type) => ({
  padding: "6px 10px",
  borderRadius: 8,
  border: 0,
  cursor: "pointer",
  background: type === "delete" ? "#dc2626" : "#111827",
  color: "#fff",
});
