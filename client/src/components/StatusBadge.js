import React from "react";

export default function StatusBadge({ status }) {
  const map = {
    PROCESSING: { bg: "#fef3c7", fg: "#92400e", text: "Processing" },
    SHIPPED:    { bg: "#dbeafe", fg: "#1e3a8a", text: "Shipped" },
    DELIVERED:  { bg: "#dcfce7", fg: "#166534", text: "Delivered" },
    CANCELLED:  { bg: "#fee2e2", fg: "#991b1b", text: "Cancelled" },
  };
  const s = map[status] || map.PROCESSING;
  return (
    <span style={{
      background: s.bg, color: s.fg, padding: "2px 8px", borderRadius: 999, fontSize: 12,
      border: "1px solid rgba(0,0,0,0.05)"
    }}>{s.text}</span>
  );
}
