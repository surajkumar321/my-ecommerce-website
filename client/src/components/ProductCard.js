// client/src/components/ProductCard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import { toggleWishlist } from "../redux/actions/wishlistActions";

export default function ProductCard({ product }) {
  const p = product || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const img = p.imageUrl || p.images?.[0]?.url || "/placeholder.png";
  const rating = Number(p.rating || 0);
  const reviews = Number(p.numReviews || 0);

  const onQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(p, 1));
  };

  const onWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(p));
  };

  return (
    <Link to={`/product/${p._id || p.id}`} className="card product"
      style={{ display: "block", textDecoration: "none", color: "inherit" }}>
      
      <div className="thumb" style={{ position: "relative" }}>
        <img src={img} alt={p.name} onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" }} />
        <div className="quick" style={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 6, zIndex: 2, pointerEvents: "auto" }}>
          <button onClick={onWish} title="Wishlist" style={iconBtn}>♥</button>
          <button onClick={onQuickAdd} title="Add to Cart" style={iconBtn}>＋</button>
        </div>
      </div>

      <div style={{ padding: "10px 6px" }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          ₹{p.discountPrice || p.actualPrice}
          {p.actualPrice > p.discountPrice && (
            <span style={{ textDecoration: "line-through", color: "#6b7280", fontSize: 13, marginLeft: 6 }}>
              ₹{p.actualPrice}
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
          {"★".repeat(Math.round(rating)).padEnd(5, "☆")} <span style={{ marginLeft: 4 }}>({reviews})</span>
        </div>
      </div>
    </Link>
  );
}

const iconBtn = {
  padding: "6px 8px",
  borderRadius: 8,
  border: 0,
  cursor: "pointer",
  background: "#111827",
  color: "#fff",
  lineHeight: 1,
};
