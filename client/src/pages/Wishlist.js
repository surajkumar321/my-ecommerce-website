import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist, clearWishlist } from "../redux/actions/wishlistActions";
import { addToCart } from "../redux/actions/cartActions";

const FALLBACK = "/placeholder.png";

function resolveImageSrc(p) {
  const raw = p?.imageUrl || p?.image || "";
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  const api = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
  const baseFromApi = api.replace(/\/api$/, "");
  const guessed = window.location.origin.replace(":3000", ":5000");
  const origin = process.env.REACT_APP_FILE_BASE || baseFromApi || guessed;
  if (!raw) return FALLBACK;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${origin}${path}`;
}

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);
  const count = items.length;

  const total = useMemo(
    () => items.reduce((s, p) => s + (p.price || 0), 0),
    [items]
  );

  const moveToCart = (p) => {
    dispatch(addToCart(p, 1));
    dispatch(removeFromWishlist(p._id));
  };

  if (!count) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: 720, margin: "24px auto", padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 48, lineHeight: 1 }}>❤️</div>
          <h2 style={{ margin: "8px 0" }}>Your wishlist is empty</h2>
          <p style={{ color: "#6b7280" }}>Save items you like to review them later.</p>
          <Link to="/" style={{ display: "inline-block", marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "#111827", color: "#fff", textDecoration: "none" }}>
            Browse products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header / toolbar */}
      <div className="wl__bar card">
        <div>
          <h2 style={{ margin: 0 }}>My Wishlist</h2>
          <div style={{ color: "#6b7280", fontSize: 14 }}>{count} item{count > 1 ? "s" : ""} • Total MRP: ₹{total}</div>
        </div>
        <div className="wl__bar-actions">
          <Link to="/" className="wl__btn wl__btn-ghost">Continue shopping</Link>
          <button className="wl__btn wl__btn-danger" onClick={() => dispatch(clearWishlist())}>Clear All</button>
        </div>
      </div>

      {/* Grid */}
      <div className="wl__grid">
        {items.map((p) => (
          <div className="wl__card card" key={p._id}>
            <Link to={`/product/${p._id}`} className="wl__imgwrap" title={p.name}>
              <img
                src={resolveImageSrc(p)}
                alt={p.name}
                onError={(e) => (e.currentTarget.src = FALLBACK)}
                className="wl__img"
              />
            </Link>

            <div className="wl__meta">
              <Link to={`/product/${p._id}`} className="wl__name">{p.name}</Link>
              <div className="wl__sub">
                <span className="wl__brand">{p.brand || "—"}</span>
                {p.category && <span className="wl__dot">•</span>}
                <span className="wl__cat">{p.category || ""}</span>
              </div>
              <div className="wl__price">₹{p.price}</div>
            </div>

            <div className="wl__actions">
              <button className="wl__btn wl__btn-primary" onClick={() => moveToCart(p)}>Move to Cart</button>
              <button className="wl__btn wl__btn-ghost" onClick={() => dispatch(removeFromWishlist(p._id))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
