import React, { useEffect, useState } from "react";

const slides = [
  {
    title: "Big Savings on Latest Arrivals",
    sub: "Shop the freshest drops — limited time offers!",
    img: "https://images.unsplash.com/photo-1512446816042-444d641267ea?q=80&w=1600&auto=format&fit=crop",
    bg: "#0f172a",
  },
  {
    title: "Accessories You’ll Love",
    sub: "Grab the must-haves starting ₹299",
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
    bg: "#111827",
  },
  {
    title: "Season Sale",
    sub: "Up to 60% off on top categories",
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop",
    bg: "#0b1220",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const s = slides[i];

  return (
    <div className="hero-wrap" style={{ background: s.bg }}>
      <img className="hero-img" src={s.img} alt={s.title} />
      <div className="hero-copy">
        <h2>{s.title}</h2>
        <p>{s.sub}</p>
        <a href="#catalog" className="hero-btn">Shop Now</a>
      </div>

      {/* dots */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`dot ${idx === i ? "active" : ""}`}
            aria-label={`slide-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}
