// client/src/pages/Checkout.js
import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../api";
import { clearCart } from "../redux/actions/cartActions";
import { getImageUrl } from "../utils/img";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items || []);

  const [addr, setAddr] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    address: "",
    area: "",
    city: "",
    state: "",
  });
  const [msg, setMsg] = useState("");

  // ✅ totals calculation with discountPrice
  const totals = useMemo(() => {
    const itemsPrice = items.reduce((s, x) => {
      const price = x.discountPrice || x.actualPrice || x.price || 0;
      return s + price * (x.qty || 1);
    }, 0);
    const shippingPrice = items.length ? 49 : 0;
    const taxPrice = Math.round(itemsPrice * 0.18);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  }, [items]);

  const placeOrder = async () => {
    try {
      setMsg("");
      if (!items.length) return setMsg("Cart is empty");
      if (!addr.fullName || !addr.phone || !addr.pincode || !addr.address || !addr.city || !addr.state) {
        return setMsg("Please fill all required address fields");
      }

      const body = {
        orderItems: items.map((x) => {
          const price = x.discountPrice || x.actualPrice || x.price || 0;
          return {
            product: x._id,
            name: x.name,
            qty: x.qty,
            price,
            imageUrl: x.imageUrl || getImageUrl(x),
          };
        }),
        shippingAddress: addr,
        itemsPrice: totals.itemsPrice,
        taxPrice: totals.taxPrice,
        shippingPrice: totals.shippingPrice,
        totalPrice: totals.totalPrice,
        paymentMethod: "COD",
      };

      const { data } = await api.post("/orders", body);
      dispatch(clearCart());
      nav(`/order/${data._id}/success`);
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };

  const onChange = (k) => (e) => setAddr((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container">
      <h2>Checkout</h2>

      <div className="checkout-grid">
        {/* LEFT: Address + Items */}
        <div>
          <div className="card" style={{ padding: 16 }}>
            <h3>Shipping Address</h3>
            <form className="addr-form" onSubmit={(e) => e.preventDefault()}>
              <input placeholder="Full name" value={addr.fullName} onChange={onChange("fullName")} />
              <input placeholder="Phone" value={addr.phone} onChange={onChange("phone")} />
              <input placeholder="Pincode" value={addr.pincode} onChange={onChange("pincode")} />
              <input placeholder="City" value={addr.city} onChange={onChange("city")} />
              <input placeholder="Area/Locality" value={addr.area} onChange={onChange("area")} />
              <input placeholder="State" value={addr.state} onChange={onChange("state")} />
              <textarea placeholder="Address (house, street…)" value={addr.address} onChange={onChange("address")} />
            </form>
          </div>

          <h3 style={{ marginTop: 16 }}>Items</h3>
          <div className="card items-list">
            {items.map((it) => {
              const price = it.discountPrice || it.actualPrice || it.price || 0;
              return (
                <div key={it._id} className="it">
                  <img
                    src={it.imageUrl || getImageUrl(it)}
                    alt={it.name}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                  <div className="meta">
                    <div className="name">{it.name}</div>
                    <div className="muted">x{it.qty}</div>
                  </div>
                  <div className="price">₹{price * (it.qty || 1)}</div>
                </div>
              );
            })}
            {!items.length && <p style={{ padding: 8 }}>No items.</p>}
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div className="card order-card">
          <h3>Order Summary</h3>
          <div className="row"><span>Subtotal</span><b>₹{totals.itemsPrice}</b></div>
          <div className="row"><span>Shipping</span><b>₹{totals.shippingPrice}</b></div>
          <div className="row"><span>Tax (18%)</span><b>₹{totals.taxPrice}</b></div>
          <hr />
          <div className="row total"><span>Total</span><b>₹{totals.totalPrice}</b></div>

          <button
            className="btn-primary full"
            onClick={placeOrder}
            disabled={!items.length}
            style={{ marginTop: 12 }}
          >
            Place Order (COD)
          </button>

          {msg && <p style={{ color: "crimson", marginTop: 8 }}>{msg}</p>}
        </div>
      </div>
    </div>
  );
}
