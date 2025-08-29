import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ErrorBanner from "../components/ErrorBanner";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    address: { fullName:"", phone:"", pincode:"", line1:"", line2:"", city:"", state:"" },
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return nav("/login?redirect=/profile", { replace: true });
    (async () => {
      try {
        const { data } = await api.get("/users/profile");
        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "",
          address: {
            fullName: data.address?.fullName || "",
            phone: data.address?.phone || "",
            pincode: data.address?.pincode || "",
            line1: data.address?.line1 || "",
            line2: data.address?.line2 || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
          },
        });
        setMsg("");
      } catch (e) { setMsg(e.userMessage || e.response?.data?.message || e.message); }
    })();
  }, [user, nav]);

  const save = async (e) => {
    e.preventDefault();
    try {
      setMsg("");
      const payload = { name: form.name, email: form.email, address: form.address };
      if (form.password) payload.password = form.password;
      await api.put("/users/profile", payload);
      setMsg("Profile updated");
    } catch (e) {
      setMsg(e.userMessage || e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="container" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      <div className="card" style={{ padding:16 }}>
        <h2>My Profile</h2>

        {!!msg && !msg.includes("updated") && <ErrorBanner message={msg} />}

        <form onSubmit={save} style={{ display:"grid", gap:10 }}>
          <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Name" required />
          <input value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" type="email" required />
          <input value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} placeholder="New Password (optional)" type="password" />

          <h3 style={{ marginTop: 8 }}>Saved Address</h3>
          {Object.entries(form.address).map(([k,v])=>(
            <input key={k} value={v} onChange={(e)=>setForm({ ...form, address: { ...form.address, [k]: e.target.value }})} placeholder={k} />
          ))}

          <button>Save</button>
          {msg.includes("updated") && <p style={{ color: "#065f46" }}>{msg}</p>}
        </form>
      </div>

      <div className="card" style={{ padding:16 }}>
        <h2>Quick Links</h2>
        <p>• Update your name/email/password</p>
        <p>• Save address to auto-fill checkout</p>
      </div>
    </div>
  );
}
