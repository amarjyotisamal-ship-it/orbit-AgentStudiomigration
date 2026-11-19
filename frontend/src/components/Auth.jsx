import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { request } from "../api.js";

export function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await request(`/auth/${mode}`, { method: "POST", body: JSON.stringify(form) });
      localStorage.setItem("poc_token", data.token);
      localStorage.setItem("poc_user", JSON.stringify(data.user));
      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <Sparkles size={24} color="#818cf8"/>
          <h2>Orbit AI</h2>
        </div>
        <p className="auth-subtitle">Independent Agent Studio Gateway</p>
        {error && <div className="error banner">{error}</div>}
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>Full Name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan"/></label>
          )}
          <label>Email<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="alex@company.com"/></label>
          <label>Password<input type="password" required minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters"/></label>
          <button className="primary" disabled={busy}>
            {busy ? "Authenticating…" : mode === "login" ? "Sign in to Orbit" : "Create Orbit Account"} <ArrowRight size={16}/>
          </button>
        </form>
        <div className="auth-switch">
          <span>{mode === "login" ? "Don't have an account?" : "Already registered?"}</span>
          <button type="button" onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
