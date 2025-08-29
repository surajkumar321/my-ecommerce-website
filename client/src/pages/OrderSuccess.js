import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="container">
      <div className="card" style={{ padding: 20, maxWidth: 640, margin: "24px auto", textAlign: "center" }}>
        <h2>🎉 Order Placed!</h2>
        <p>Your order ID is <b>{id}</b>.</p>
        {order && (
          <>
            <p>Total: <b>₹{order.totalPrice}</b></p>
            <p>Payment: <b>{order.paymentMethod}</b></p>
            <p>Status: <b>{order.status}</b></p>
          </>
        )}
        <div style={{ marginTop: 16 }}>
          <Link to="/">Continue Shopping →</Link>
        </div>
      </div>
    </div>
  );
}
