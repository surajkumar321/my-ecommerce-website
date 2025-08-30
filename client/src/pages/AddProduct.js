import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    actualPrice: "",
    discountPrice: "",
    category: "",
    stock: "",
    description: "",
    brand: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const onFiles = (e) => {
    const arr = Array.from(e.target.files || [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 6);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("images", f));

      await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      nav("/admin/dashboard");
    } catch (e2) {
      setMsg(e2.response?.data?.message || e2.message);
    }
  };

  return (
    <div className="container">
      <h2>Add Product (Multiple Images)</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 560 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Actual Price"
          value={form.actualPrice}
          onChange={(e) => setForm({ ...form, actualPrice: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Discount Price"
          value={form.discountPrice}
          onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
          required
        />
        <input
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label>Product Images (up to 6)</label>
        <input type="file" accept="image/*" multiple onChange={onFiles} />
        {previews.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: 8,
              gridTemplateColumns: "repeat(auto-fill, minmax(100px,1fr))",
            }}
          >
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={"p" + i}
                style={{
                  width: "100%",
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => nav(-1)}>
            Cancel
          </button>
        </div>
        {msg && <p style={{ color: "red" }}>{msg}</p>}
      </form>
    </div>
  );
}

