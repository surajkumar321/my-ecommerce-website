// client/src/pages/ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import { toggleWishlist } from "../redux/actions/wishlistActions";
import RatingStars from "../components/RatingStars";
import ErrorBanner from "../components/ErrorBanner";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ✅ take auth from Redux (NOT localStorage "user")
  const { token, user } = useSelector((s) => s.auth || {});
  const isAuthed = !!token;

  const [p, setP] = useState(null);
  const [active, setActive] = useState("");
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setP(data);
      const imgs = data.images?.length
        ? data.images.map((i) => i.url)
        : data.imageUrl
        ? [data.imageUrl]
        : [];
      setActive(imgs[0] || "");
      setMsg("");
    } catch (e) {
      setMsg(e.userMessage || e.response?.data?.message || e.message);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (!p) {
    return (
      <div className="container">
        {msg ? <ErrorBanner message={msg} /> : <p>Loading…</p>}
      </div>
    );
  }

  const imgs = p.images?.length ? p.images.map((i) => i.url) : p.imageUrl ? [p.imageUrl] : [];
  const main = active || imgs[0] || "/placeholder.png";

  const submitReview = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      if (!isAuthed) {
        setMsg("Please login to write a review.");
        return;
      }
      await api.post(`/products/${p._id}/reviews`, { rating, comment });
      setComment("");
      setRating(5);
      await load();
      setMsg("Thanks! Your review was added.");
    } catch (err) {
      setMsg(err.userMessage || err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container" style={{ padding: 16 }}>
      {/* Gallery + Info */}
      <div className="pdp">
        <div className="pdp-main">
          <img
            src={main}
            alt={p.name}
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
          {imgs.length > 1 && (
            <div className="pdp-thumbs">
              {imgs.map((u, i) => (
                <img
                  key={i}
                  src={u}
                  alt={"thumb-" + i}
                  onClick={() => setActive(u)}
                  className={u === main ? "is-active" : ""}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          {!!msg && <ErrorBanner message={msg} />}
          <h2>{p.name}</h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <RatingStars value={Number(p.rating || 0)} />
            <span style={{ color: "#6b7280" }}>{p.numReviews || 0} reviews</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>₹{p.price}</div>
          <p style={{ color: "#6b7280" }}>
            {p.brand} {p.category ? `• ${p.category}` : ""}
          </p>
          <p>{p.description}</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{ width: 90 }}
            />
            <button onClick={() => dispatch(addToCart(p, qty))}>Add to Cart</button>
            <button onClick={() => dispatch(toggleWishlist(p))}>❤️ Wishlist</button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card" style={{ marginTop: 24, padding: 16 }}>
        <h3>Customer Reviews</h3>

        {(!p.reviews || p.reviews.length === 0) ? (
          <p style={{ color: "#6b7280" }}>Be the first to review.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {p.reviews.map((r, i) => (
              <div key={i} style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <strong>{r.name}</strong>
                  <RatingStars value={Number(r.rating || 0)} size={14} />
                  <span style={{ color: "#9ca3af", fontSize: 12 }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <div style={{ marginTop: 6 }}>{r.comment}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <h4>Write a Review</h4>
          {!isAuthed ? (
            <ErrorBanner message="Please login to write a review." />
          ) : (
            <form onSubmit={submitReview} style={{ display: "grid", gap: 10, maxWidth: 480 }}>
              <label>
                Rating
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ marginLeft: 8 }}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </label>
              <textarea
                placeholder="Share your experience…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <div><button type="submit">Submit Review</button></div>
              {msg && (
                <p style={{ color: msg.startsWith("Thanks") ? "#065f46" : "#ef4444" }}>
                  {msg}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


