import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";

export default function Navbar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false); // ✅ mobile menu
  const nav = useNavigate();
  const loc = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) =>
    (s.cart?.items || []).reduce((a, c) => a + (c.qty || 0), 0)
  );
  const wishlistCount = useSelector((s) => (s.wishlist?.items || []).length);

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(loc.search);
    if (q) params.set("keyword", q);
    else params.delete("keyword");
    nav(`/?${params.toString()}`);
    setOpen(false);
  };

  const onLogout = () => {
    dispatch(logoutUser());
    nav("/");
    setOpen(false);
  };

  return (
    <header className="nav">
      {/* left: brand + (admin if admin) */}
      <div className="nav__brand">
        <Link to="/">🏠 Home</Link>
        {user?.isAdmin && (
          <>
            <span className="sep" />
            <Link to="/admin">🔑 Admin</Link>
          </>
        )}
      </div>

      {/* mobile toggle */}
      <button
        className="nav__toggle"
        onClick={() => setOpen((x) => !x)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        ☰
      </button>

      {/* search */}
      <form className="nav__search" onSubmit={search}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for products"
        />
        <button>Search</button>
      </form>

      {/* right links */}
      <nav className={`nav__links ${open ? "is-open" : ""}`}>
        <Link to="/wishlist" onClick={() => setOpen(false)}>
          ❤️ Wishlist {wishlistCount ? `(${wishlistCount})` : ""}
        </Link>
        <Link to="/cart" onClick={() => setOpen(false)}>
          🛒 Cart {cartCount ? `(${cartCount})` : ""}
        </Link>

        {user ? (
          <>
            <Link to="/my-orders" onClick={() => setOpen(false)}>
              📦 My Orders
            </Link>
            <Link to="/profile" onClick={() => setOpen(false)}>
              🧑 {user.name}
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="nav__btn nav__btn-danger"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>
              Sign In
            </Link>
            <Link to="/register" onClick={() => setOpen(false)}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

