import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";

const Skeleton = () => (
  <div className="card sk">
    <div className="sk-img" />
    <div className="sk-line" />
    <div className="sk-line short" />
  </div>
);

export default function Home() {
  // raw data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ui/filters
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");          // 👈 NEW
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [rating, setRating] = useState(0);
  const [q, setQ] = useState("");

  // pagination (client side)
  const [page, setPage] = useState(1);
  const perPage = 12;

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products?limit=100");
      const list = Array.isArray(data) ? data : data?.items || [];
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // derived categories (chips)
  const categories = useMemo(() => {
    const set = new Set(items.map((p) => (p.category || "Other").trim()));
    return ["All", ...Array.from(set)];
  }, [items]);

  // derived brands (chips)
  const brands = useMemo(() => {
    const set = new Set(
      items.map((p) => (p.brand && String(p.brand).trim()) || "Unbranded")
    );
    return ["All", ...Array.from(set)];
  }, [items]);

  // filter + sort
  const filtered = useMemo(() => {
    let arr = [...items];

    if (q.trim()) {
      const t = q.trim().toLowerCase();
      arr = arr.filter(
        (p) =>
          p?.name?.toLowerCase().includes(t) ||
          p?.category?.toLowerCase().includes(t) ||
          (p?.brand ? String(p.brand).toLowerCase().includes(t) : false) // 👈 brand in search
      );
    }

    if (category !== "All") {
      arr = arr.filter((p) => (p.category || "Other") === category);
    }

    if (brand !== "All") {
      arr = arr.filter(
        (p) => (p.brand && String(p.brand).trim()) === brand
      );
    }

    const minP = Number(min || 0);
    const maxP = Number(max || 0);
    if (minP) arr = arr.filter((p) => Number(p.price || 0) >= minP);
    if (maxP) arr = arr.filter((p) => Number(p.price || 0) <= maxP);

    if (rating > 0) arr = arr.filter((p) => Number(p.rating || 0) >= rating);

    switch (sortBy) {
      case "price-asc":
        arr.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        arr.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        arr.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      default: // latest
        arr.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }
    return arr;
  }, [items, q, category, brand, min, max, sortBy, rating]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    // reset to page 1 on any filter change
    setPage(1);
  }, [q, category, brand, min, max, sortBy, rating]);

  return (
    <div>
      {/* Hero */}
      <HeroCarousel />

      {/* Filters panel */}
      <div className="container" id="catalog">
        <div className="toolbar">
          {/* category chips */}
          <div className="chips" style={{ marginBottom: 8 }}>
            {categories.map((c) => (
              <button
                key={c}
                className={`chip ${c === category ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* ✅ brand chips */}
          <div className="chips" style={{ marginBottom: 12 }}>
            {brands.map((b) => (
              <button
                key={b}
                className={`chip ${b === brand ? "active" : ""}`}
                onClick={() => setBrand(b)}
                title={b}
              >
                {b}
              </button>
            ))}
          </div>

          {/* search row */}
          <div className="row grid">
            <div className="col">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products… (name, category, brand)"
              />
            </div>
            <div className="col range">
              <label>Min</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="col range">
              <label>Max</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="50000"
              />
            </div>
            <div className="col">
              <label>Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={0}>All</option>
                <option value={4}>4★ & up</option>
                <option value={3}>3★ & up</option>
                <option value={2}>2★ & up</option>
              </select>
            </div>
            <div className="col">
              <label>Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="meta">
            Results: <b>{filtered.length}</b>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid cards">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ padding: 24 }}>No products found.</p>
        ) : (
          <>
            <div className="grid cards">
              {paged.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>

            {/* pagination */}
            <div className="pager">
              <button disabled={page <= 1} onClick={() => setPage((x) => x - 1)}>
                ‹ Prev
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((x) => x + 1)}
              >
                Next ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
