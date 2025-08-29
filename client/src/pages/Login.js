// client/src/pages/Login.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/authActions";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, error } = useSelector((s) => s.auth);

  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const redirect = new URLSearchParams(loc.search).get("redirect") || "/";

  useEffect(() => {
    if (user) nav(redirect);
  }, [user, nav, redirect]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 24 }}>
      <div className="card" style={{ padding: 16 }}>
        <h2>Sign In</h2>
        {!!error && <ErrorBanner message={error} />}
        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
          <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
          <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
        </form>
        <p style={{ marginTop: 8 }}>
          New customer? <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>Create account</Link>
        </p>
      </div>
    </div>
  );
}

