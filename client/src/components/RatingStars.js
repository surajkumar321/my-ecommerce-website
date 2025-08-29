// src/components/RatingStars.js
import React from "react";

export default function RatingStars({ value = 0, count = 5, size = 16 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = count - full - (half ? 1 : 0);

  const Star = ({ filled }) => (
    <span style={{ fontSize: size, color: filled ? "#f59e0b" : "#d1d5db" }}>★</span>
  );

  return (
    <span title={`${value.toFixed(1)}/${count}`}>
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} filled />)}
      {half && <span style={{ position: "relative", display: "inline-block", width: size }}>
        <span style={{ position: "absolute", left: 0, width: size / 2, overflow: "hidden", color: "#f59e0b", fontSize: size }}>★</span>
        <span style={{ color: "#d1d5db", fontSize: size }}>★</span>
      </span>}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} />)}
    </span>
  );
}
