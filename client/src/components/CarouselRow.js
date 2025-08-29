// src/components/CarouselRow.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import ProductMiniCard from "./ProductMiniCard";

export default function CarouselRow({
  title = "Top Picks",
  params = {},           // { category, sort, limit, min, max, keyword }
  linkTo = "/",          // optional "View all" link
  autoplay = true,
  interval = 3000,       // ms
}) {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const scrollerRef = useRef(null);

  // fetch products only for this row
  useEffect(() => {
    (async () => {
      try {
        const qs = new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter(([,v]) => v !== "" && v != null))
        ).toString();
        const { data } = await api.get(`/products${qs ? `?${qs}` : ""}`);
        const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        setItems(list);
      } catch (e) {
        setMsg(e.response?.data?.message || e.message);
      }
    })();
  }, [JSON.stringify(params)]); // safe dependency

  // auto-scroll
  useEffect(() => {
    if (!autoplay) return;
    const el = scrollerRef.current;
    if (!el) return;
    const t = setInterval(() => {
      const max = el.scrollWidth - el.clientWidth;
      const next = Math.min(el.scrollLeft + 280, max);
      el.scrollTo({ left: next === max ? 0 : next, behavior: "smooth" });
    }, interval);
    return () => clearInterval(t);
  }, [items, autoplay, interval]);

  const canScroll = useMemo(() => items.length > 0, [items]);

  const nudge = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = dir === "left" ? -280 : 280;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="row container">
      <div className="row__head">
        <h3>{title}</h3>
        {linkTo && <a href={linkTo} className="row__link">View all</a>}
      </div>

      {msg && <p className="error">{msg}</p>}

      <div className="row__wrap">
        {canScroll && (
          <>
            <button className="row__arrow left" onClick={() => nudge("left")} aria-label="Scroll left">‹</button>
            <button className="row__arrow right" onClick={() => nudge("right")} aria-label="Scroll right">›</button>
          </>
        )}

        <div className="row__scroller" ref={scrollerRef}>
          {items.map((p) => (
            <div className="row__item" key={p._id}>
              <ProductMiniCard product={p} />
            </div>
          ))}
          {items.length === 0 && <div style={{ padding: 16 }}>No items</div>}
        </div>
      </div>
    </section>
  );
}
