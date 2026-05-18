"use client";
import { useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [pw, setPw]       = useState("");
  const [authed, setAuthed] = useState(false);
  const [err, setErr]     = useState(false);

  const check = () => {
    // Uses env var ADMIN_PASSWORD, fallback for dev
    const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "sandy@admin123";
    if (pw === correct) { setAuthed(true); setErr(false); }
    else { setErr(true); }
  };

  if (authed) return <AdminDashboard />;

  return (
    <div style={{ minHeight:"100vh", background:"#07090D", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div style={{ width:"100%", maxWidth:"380px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(195,252,254,0.12)", borderRadius:"20px", padding:"2rem" }}>
        <div style={{ textAlign:"center", marginBottom:"1.75rem" }}>
          <p style={{ fontSize:"2rem", margin:"0 0 0.5rem" }}>🔐</p>
          <h1 style={{ fontSize:"1.25rem", fontWeight:800, color:"#F5F7FA", margin:"0 0 0.25rem" }}>Admin Access</h1>
          <p style={{ color:"#8B909E", fontSize:"0.85rem", margin:0 }}>Sandy.Lifts — Private Dashboard</p>
        </div>
        <input type="password" value={pw} placeholder="Enter admin password"
          onChange={e => { setPw(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && check()}
          style={{ width:"100%", padding:"0.75rem 1rem", borderRadius:"10px", fontSize:"0.9rem", marginBottom:"0.75rem",
            background:"rgba(255,255,255,0.04)", border:`1px solid ${err ? "#FF4444" : "rgba(195,252,254,0.2)"}`,
            color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
        {err && <p style={{ color:"#FF4444", fontSize:"0.78rem", margin:"0 0 0.75rem" }}>Incorrect password. Try again.</p>}
        <button onClick={check}
          style={{ width:"100%", padding:"0.85rem", borderRadius:"12px", fontWeight:700, fontSize:"0.95rem", cursor:"pointer", border:"none",
            background:"linear-gradient(135deg,#4DA3FF,#66E6FF)", color:"#07090D" }}>
          Enter Dashboard
        </button>
      </div>
    </div>
  );
}
