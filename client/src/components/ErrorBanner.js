// client/src/components/ErrorBanner.jsx
import React from "react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: "#fee2e2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        padding: "10px 12px",
        borderRadius: 8,
        margin: "8px 0",
      }}
      role="alert"
    >
      {message}
    </div>
  );
}
