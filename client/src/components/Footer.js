import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // 👈 import CSS

export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft__grid container">
        {/* Brand / About */}
        <div className="ft__col">
          <h2 className="ft__brand">🛍️ MyShop</h2>
          <p className="ft__muted">
            India’s trusted shopping destination. Best products, fast delivery,
            secure payments.
          </p>
        </div>

        {/* Shop Links */}
        <div className="ft__col">
          <h4 className="ft__title">Shop</h4>
          <ul className="ft__list">
            <li><Link className="ft__link" to="/">Home</Link></li>
            <li><Link className="ft__link" to="/cart">Cart</Link></li>
            <li><Link className="ft__link" to="/wishlist">Wishlist</Link></li>
            <li><Link className="ft__link" to="/my-orders">My Orders</Link></li>
            <li><Link className="ft__link" to="/profile">My Profile</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="ft__col">
          <h4 className="ft__title">Customer Support</h4>
          <ul className="ft__list">
            <li><Link className="ft__link" to="/about">About Us</Link></li>
            <li><Link className="ft__link" to="/contact">Contact</Link></li>
            <li><Link className="ft__link" to="/faq">FAQ</Link></li>
            <li><Link className="ft__link" to="/returns">Returns Policy</Link></li>
            <li><Link className="ft__link" to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social + Payment */}
        <div className="ft__col">
          <h4 className="ft__title">Stay Connected</h4>
          <div className="ft__social">
            <a className="ft__socialLink" href="https://facebook.com" target="_blank" rel="noreferrer">🌐</a>
            <a className="ft__socialLink" href="https://instagram.com" target="_blank" rel="noreferrer">📸</a>
            <a className="ft__socialLink" href="https://twitter.com" target="_blank" rel="noreferrer">🐦</a>
            <a className="ft__socialLink" href="https://linkedin.com" target="_blank" rel="noreferrer">💼</a>
          </div>
          <h4 className="ft__title" style={{marginTop:12}}>We Accept</h4>
          <div className="ft__payments">
            {/* icons ko public/ me rakho: /visa.png, /mastercard.png, /upi.png, /paypal.png */}
            <img src="/visa.png" alt="Visa" />
            <img src="/mastercard.png" alt="Mastercard" />
            <img src="/upi.png" alt="UPI" />
            <img src="/paypal.png" alt="Paypal" />
          </div>
        </div>
      </div>

      <div className="ft__bottom">
        © {new Date().getFullYear()} MyShop. All rights reserved.
      </div>
    </footer>
  );
}
