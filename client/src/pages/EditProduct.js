// client/src/pages/EditProduct.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function EditProduct() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "", price: "", brand: "", category: "", stock: "", description: ""
  });
  const [serverImages, setServerImages] = useState([]); // existing images
  const [files, setFiles] = useState([]);               // new uploads (replace)
  const [previews, setPreviews] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setForm({
          name: data.name || "",
          price: data.price || "",
          brand: data.brand || "",
          category: data.category || "",
          stock: data.stock ?? "",
          description: data.description || "",
        });
        // Prefer multi-images; fallback to legacy one
        const existing =
          Array.isArray(data.images) && data.images.length
            ? data.images
            : data.imageUrl
            ? [{ url: data.imageUrl, publicId: data.imagePublicId }]
            : [];
        setServerImages(existing);
      } catch (e) {
        alert(e.response?.data?.message || "Product not found");
        nav("/admin/dashboard", { replace: true });
      }
    })();
  }, [id, nav]);

  const onFiles = (e) => {
    const arr = Array.from(e.target.files || [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 6);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      // If any files selected, backend will replace entire image set
      files.forEach((f) => fd.append("images", f));
      await api.put(`/products/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      nav("/admin/dashboard");
    } catch (e2) {
      setMsg(e2.response?.data?.message || e2.message);
    }
  };

  return (
    <div className="container">
      <h2>Edit Product</h2>
      <form onSubmit={save} style={{ display: "grid", gap: 10, maxWidth: 560 }}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
        />
        <input
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          placeholder="Brand"
        />
        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
        />
        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="Stock"
        />
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Description"
        />

        <div>
          <label>Current Images</label>
          <div
            style={{
              display: "grid",
              gap: 8,
              gridTemplateColumns: "repeat(auto-fill, minmax(100px,1fr))",
            }}
          >
            {serverImages.map((im, i) => (
              <img
                key={i}
                src={im.url || "/placeholder.png"}
                alt={"img" + i}
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                style={{
                  width: "100%",
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
        </div>

        <label>Upload New Images (replace all)</label>
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

