import React from "react";

const CATS = [
  { key: "Mobiles", label: "Mobiles", icon: "📱" },
  { key: "Laptops", label: "Laptops", icon: "💻" },
  { key: "Headphones", label: "Audio", icon: "🎧" },
  { key: "Shoes", label: "Shoes", icon: "👟" },
];

export default function CategoryStrip({ active = "", onPick }) {
  return (
    <div className="catstrip container">
      {CATS.map((c) => (
        <button
          key={c.key}
          className={`cat ${active === c.key ? "is-active" : ""}`}
          onClick={() => onPick(active === c.key ? "" : c.key)}
        >
          <span className="cat__icon">{c.icon}</span>
          <span className="cat__label">{c.label}</span>
        </button>
      ))}
    </div>
  );
}
