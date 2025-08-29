import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/login", { email, password });
      // save auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setMsg("Login success!");
      // go to dashboard
      navigate("/admin/dashboard", { replace: true });
    } catch (e) {
      setMsg(e.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="password" />
        <button>Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
