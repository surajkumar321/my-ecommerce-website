// src/pages/Cart.js
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, setQty, clearCart } from "../redux/actions/cartActions";

export default function Cart() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const items = useSelector((s) => s.cart.items);

  // ✅ totals calculation
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => {
      const price = it.discountPrice || it.actualPrice || it.price || 0;
      return sum + price * (it.qty || 1);
    }, 0);
    const count = items.reduce((c, it) => c + (it.qty || 1), 0);
    return { subtotal, count };
  }, [items]);

  const changeQty = (id, q) => {
    const qty = Number(q);
    if (qty < 1) return;
    dispatch(setQty(id, qty));
  };

  if (!items.length) {
    return (
      <div className="container">
        <h2>Your Cart</h2>
        <p>Cart is empty.</p>
        <Link to="/">Go shopping →</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Your Cart</h2>

      <div className="cart-grid">
        {/* Items */}
        <div className="card" style={{ overflowX: "auto" }}>
          <table className="cart-table">
            <thead>
              <tr>
                <Th align="left">Product</Th>
                <Th>Price</Th>
                <Th>Qty</Th>
                <Th>Total</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const price = it.discountPrice || it.actualPrice || it.price || 0;
                return (
                  <tr key={it._id} style={{ borderTop: "1px solid #eee" }}>
                    <Td align="left" dataLabel="Product">
                      <div className="cart-prod">
                        <img
                          src={it.imageUrl || it.images?.[0]?.url || "/placeholder.png"}
                          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                          alt={it.name}
                        />
                        <div>
                          <div className="name">{it.name}</div>
                          <div className="sub">{it.category || "—"}</div>
                        </div>
                      </div>
                    </Td>

                    {/* ✅ Price Section */}
                    <Td dataLabel="Price">
                      {it.actualPrice && it.discountPrice ? (
                        <>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#6b7280",
                              textDecoration: "line-through",
                              marginRight: 6,
                            }}
                          >
                            ₹{it.actualPrice}
                          </span>
                          <span style={{ fontSize: 16, fontWeight: 700 }}>
                            ₹{it.discountPrice}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: 16, fontWeight: 700 }}>
                          ₹{it.price}
                        </span>
                      )}
                    </Td>

                    <Td dataLabel="Qty">
                      <select
                        value={it.qty || 1}
                        onChange={(e) => changeQty(it._id, e.target.value)}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </Td>

                    {/* ✅ Total per item */}
                    <Td dataLabel="Total">₹{price * (it.qty || 1)}</Td>

                    <Td dataLabel="Action">
                      <button
                        onClick={() => dispatch(removeFromCart(it._id))}
                        style={btn("delete")}
                      >
                        Remove
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="card cart-summary" style={{ height: "fit-content" }}>
          <h3>Order Summary</h3>
          <div style={{ display: "grid", gap: 6 }}>
            <Row label="Items">{totals.count}</Row>
            <Row label="Subtotal">₹{totals.subtotal}</Row>
          </div>
          <button
            style={{ ...btn("primary"), width: "100%", marginTop: 12 }}
            onClick={() => nav("/checkout")}
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => dispatch(clearCart())}
            style={{ ...btn("ghost"), width: "100%", marginTop: 8 }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const Th = ({ children, align = "center" }) => (
  <th
    style={{
      textAlign: align,
      fontSize: 14,
      color: "#6b7280",
      padding: "10px 8px",
    }}
  >
    {children}
  </th>
);

const Td = ({ children, align = "center", style, dataLabel }) => (
  <td
    style={{ textAlign: align, padding: "12px 8px", ...style }}
    data-label={dataLabel}
  >
    {children}
  </td>
);

const btn = (type) => {
  if (type === "delete")
    return {
      padding: "6px 10px",
      borderRadius: 8,
      border: 0,
      background: "#dc2626",
      color: "#fff",
      cursor: "pointer",
    };
  if (type === "primary")
    return {
      padding: "10px 12px",
      borderRadius: 8,
      border: 0,
      background: "#111827",
      color: "#fff",
      cursor: "pointer",
    };
  if (type === "ghost")
    return {
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #e5e7eb",
      background: "#fff",
      cursor: "pointer",
    };
  return {};
};

const Row = ({ label, children }) => (
  <div
    style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}
  >
    <span style={{ color: "#6b7280" }}>{label}</span>
    <span style={{ fontWeight: 600 }}>{children}</span>
  </div>
);

