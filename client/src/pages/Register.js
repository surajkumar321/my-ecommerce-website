import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/actions/authActions";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const redirect = new URLSearchParams(loc.search).get("redirect") || "/";

  useEffect(() => { if (user) nav(redirect); }, [user, nav, redirect]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(registerUser(name, email, password));
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 24 }}>
      <div className="card" style={{ padding: 16 }}>
        <h2>Create Account</h2>
        {!!error && <ErrorBanner message={error} />}
        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" required />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" required />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required />
          <button type="submit" disabled={loading}>{loading ? "Creating…" : "Register"}</button>
        </form>
        <p style={{ marginTop: 8 }}>
          Have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
