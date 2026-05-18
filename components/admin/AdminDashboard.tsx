"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Submission {
  id: string; created_at: string; gender: string; name: string; age: string;
  height: string; weight: string; body_type: string; health_conditions: string;
  goals: string; comments: string; status: string;
}

const STATUS_COLORS: Record<string, string> = {
  "New":       "rgba(229,152,155,0.15)",
  "Reviewed":  "rgba(245,158,11,0.15)",
  "Plan Sent": "rgba(16,185,129,0.15)",
};
const STATUS_TEXT: Record<string, string> = {
  "New":"#E5989B", "Reviewed":"#F59E0B", "Plan Sent":"#10B981"
};

export function AdminDashboard() {
  const [rows, setRows]         = useState<Submission[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filter, setFilter]     = useState("All");
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!supabase) { setError("Supabase not configured yet."); setLoading(false); return; }
    supabase.from("intake_submissions").select("*").order("created_at", { ascending: false })
      .then(({ data, error: e }) => {
        if (e) setError(e.message);
        else setRows((data as Submission[]) || []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    await supabase.from("intake_submissions").update({ status }).eq("id", id);
    setRows(r => r.map(x => x.id === id ? { ...x, status } : x));
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null);
  };

  const filtered = filter === "All" ? rows : rows.filter(r => r.status === filter);

  const th = { padding:"0.6rem 0.75rem", textAlign:"left" as const, fontSize:"0.73rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#52525B", borderBottom:"1px solid rgba(255,255,255,0.06)", whiteSpace:"nowrap" as const };
  const td = { padding:"0.75rem", fontSize:"0.82rem", color:"#D8DBFC", borderBottom:"1px solid rgba(255,255,255,0.04)", verticalAlign:"top" as const };

  return (
    <div style={{ minHeight:"100vh", background:"#07090D", paddingTop:"80px", paddingBottom:"60px" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 1.25rem" }}>

        {/* Header */}
        <div style={{ marginBottom:"2rem" }}>
          <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#4DA3FF", marginBottom:"0.5rem" }}>Sandy.Lifts Admin</p>
          <h1 style={{ fontSize:"clamp(1.5rem,4vw,2rem)", fontWeight:900, color:"#F5F7FA", margin:"0 0 0.25rem" }}>Intake Submissions</h1>
          <p style={{ color:"#8B909E", fontSize:"0.875rem" }}>{rows.length} total submissions</p>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
          {["All","New","Reviewed","Plan Sent"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:"0.4rem 1rem", borderRadius:"999px", fontSize:"0.8rem", fontWeight:600, cursor:"pointer",
                background: filter===f ? "rgba(77,163,255,0.15)" : "rgba(255,255,255,0.03)",
                border:`1px solid ${filter===f ? "rgba(77,163,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: filter===f ? "#66E6FF" : "#8B909E" }}>
              {f}
            </button>
          ))}
        </div>

        {error && <div style={{ background:"rgba(255,68,68,0.1)", border:"1px solid rgba(255,68,68,0.3)", borderRadius:"12px", padding:"1rem", color:"#FF6B6B", fontSize:"0.85rem", marginBottom:"1.5rem" }}>⚠️ {error}<br/><span style={{ fontSize:"0.75rem", opacity:0.7 }}>Set up Supabase first — see the setup guide.</span></div>}

        {loading ? (
          <div style={{ textAlign:"center", padding:"4rem", color:"#8B909E" }}>Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem", color:"#52525B" }}>
            <p style={{ fontSize:"2rem" }}>📭</p>
            <p>No submissions yet.</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap:"1rem", alignItems:"start" }}>

            {/* Table */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"16px", overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"rgba(0,0,0,0.3)" }}>
                      <th style={th}>Name</th>
                      <th style={th}>Gender</th>
                      <th style={th}>Goal</th>
                      <th style={th}>Date</th>
                      <th style={th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(row => {
                      const goals = (() => { try { return JSON.parse(row.goals)?.main || "—"; } catch { return "—"; } })();
                      return (
                        <tr key={row.id} onClick={() => setSelected(row)} style={{ cursor:"pointer", background: selected?.id===row.id ? "rgba(77,163,255,0.06)" : "transparent" }}
                          onMouseEnter={e => { if (selected?.id!==row.id) (e.currentTarget as HTMLTableRowElement).style.background="rgba(255,255,255,0.02)"; }}
                          onMouseLeave={e => { if (selected?.id!==row.id) (e.currentTarget as HTMLTableRowElement).style.background="transparent"; }}>
                          <td style={td}><span style={{ fontWeight:600, color:"#F5F7FA" }}>{row.name||"—"}</span><br/><span style={{ fontSize:"0.72rem", color:"#52525B" }}>{row.age} yrs · {row.weight} kg</span></td>
                          <td style={td}>
                            <span style={{ padding:"0.2rem 0.6rem", borderRadius:"999px", fontSize:"0.72rem", fontWeight:600,
                              background: row.gender==="women"?"rgba(255,107,157,0.15)":"rgba(77,163,255,0.15)",
                              color: row.gender==="women"?"#FF6B9D":"#4DA3FF" }}>
                              {row.gender==="women"?"🩷 Women":"💪 Men"}
                            </span>
                          </td>
                          <td style={td}>{goals}</td>
                          <td style={{ ...td, color:"#52525B", fontSize:"0.75rem" }}>{new Date(row.created_at).toLocaleDateString("en-IN")}</td>
                          <td style={td}>
                            <span style={{ padding:"0.2rem 0.65rem", borderRadius:"999px", fontSize:"0.72rem", fontWeight:700,
                              background: STATUS_COLORS[row.status]||"rgba(255,255,255,0.05)",
                              color: STATUS_TEXT[row.status]||"#8B909E" }}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"1.25rem", position:"sticky", top:"90px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:"1rem" }}>
                  <div>
                    <p style={{ margin:0, fontSize:"1rem", fontWeight:700, color:"#F5F7FA" }}>{selected.name}</p>
                    <p style={{ margin:0, fontSize:"0.75rem", color:"#8B909E" }}>{selected.age} yrs · {selected.height} · {selected.weight} kg</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"#8B909E", cursor:"pointer", fontSize:"1.2rem" }}>×</button>
                </div>

                <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1rem" }}>
                  {["New","Reviewed","Plan Sent"].map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      style={{ padding:"0.35rem 0.75rem", borderRadius:"999px", fontSize:"0.73rem", fontWeight:600, cursor:"pointer",
                        background: selected.status===s ? (STATUS_COLORS[s]||"rgba(255,255,255,0.1)") : "rgba(255,255,255,0.03)",
                        border:`1px solid ${selected.status===s ? (STATUS_TEXT[s]||"#fff") : "rgba(255,255,255,0.1)"}`,
                        color: selected.status===s ? (STATUS_TEXT[s]||"#fff") : "#8B909E" }}>
                      {s}
                    </button>
                  ))}
                </div>

                {[
                  ["Health", selected.health_conditions],
                  ["Body Type", selected.body_type],
                  ["Comments", selected.comments],
                  ["Date", new Date(selected.created_at).toLocaleString("en-IN")],
                ].map(([k,v]) => v ? (
                  <div key={k} style={{ padding:"0.6rem 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <p style={{ margin:0, fontSize:"0.7rem", color:"#52525B", textTransform:"uppercase", letterSpacing:"0.1em" }}>{k}</p>
                    <p style={{ margin:"0.2rem 0 0", fontSize:"0.82rem", color:"#D8DBFC" }}>{v}</p>
                  </div>
                ) : null)}

                <a href={`https://wa.me/918968244407?text=Hi%20${encodeURIComponent(selected.name||"")}!%20Sandy%20from%20Sandy.Lifts%20here.%20Your%20personalised%20plan%20is%20ready%20%F0%9F%8E%89`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", marginTop:"1rem", padding:"0.75rem", borderRadius:"10px", background:"rgba(37,211,102,0.1)", border:"1px solid rgba(37,211,102,0.3)", color:"#25D366", textDecoration:"none", fontSize:"0.85rem", fontWeight:600 }}>
                  💬 Reply on WhatsApp
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
