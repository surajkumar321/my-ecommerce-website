// src/components/ProductMiniCard.js
import React from "react";
import { Link } from "react-router-dom";

const FALLBACK = "/placeholder.png";

function resolveImageSrc(product) {
  const raw = product?.imageUrl || product?.image || "";
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  const api = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
  const baseFromApi = api.replace(/\/api$/, "");
  const guessed = window.location.origin.replace(":3000", ":5000");
  const origin = process.env.REACT_APP_FILE_BASE || baseFromApi || guessed;
  if (!raw) return FALLBACK;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${origin}${path}`;
}

export default function ProductMiniCard({ product }) {
  const img = resolveImageSrc(product);
  return (
    <Link to={`/product/${product._id}`} className="mini">
      <img
        src={img}
        alt={product.name}
        onError={(e) => (e.currentTarget.src = FALLBACK)}
        className="mini__img"
      />
      <div className="mini__name" title={product.name}>{product.name}</div>
      <div className="mini__price">₹{product.price}</div>
    </Link>
  );
}
