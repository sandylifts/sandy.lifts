"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Submission {
  id: string; created_at: string; gender: string; name: string; age: string;
  height: string; weight: string; body_type: string; health_conditions: string;
  lifestyle?: string; diet?: string; fitness?: string;
  goals: string; comments: string; status: string;
}

const parseJSON = (str?: string) => {
  if (!str) return {};
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

const STATUS_COLORS: Record<string, string> = {
  "New":       "rgba(229,152,155,0.15)",
  "Reviewed":  "rgba(245,158,11,0.15)",
  "Plan Sent": "rgba(16,185,129,0.15)",
};
const STATUS_TEXT: Record<string, string> = {
  "New":"#E5989B", "Reviewed":"#F59E0B", "Plan Sent":"#10B981"
};

export function AdminDashboard({ password = "" }: { password?: string }) {
  const [rows, setRows]         = useState<Submission[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filter, setFilter]     = useState("All");
  const [error, setError]       = useState("");

  useEffect(() => {
    fetch("/api/admin/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setError(res.error);
        } else {
          setRows(res.data || []);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to fetch submissions");
        setLoading(false);
      });
  }, [password]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "update", id, status }),
      });
      const data = await res.json();
      if (data.error) {
        alert("Failed to update status: " + data.error);
        return;
      }
      setRows(r => r.map(x => x.id === id ? { ...x, status } : x));
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : null);
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  const downloadPDF = (item: Submission) => {
    const lifestyle = parseJSON(item.lifestyle);
    const diet = parseJSON(item.diet);
    const fitness = parseJSON(item.fitness);
    const goals = parseJSON(item.goals);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download PDF.");
      return;
    }

    const titleColor = item.gender === "women" ? "#db2777" : "#2563eb";
    const highlightColor = item.gender === "women" ? "#fce7f3" : "#dbeafe";

    const renderRow = (icon: string, label: string, value: any) => {
      const valStr = Array.isArray(value) ? value.join(", ") : value;
      if (!valStr || valStr === "None" || valStr === "[]") return "";
      return `
        <div class="row">
          <span class="row-label"><span>${icon}</span> ${label}</span>
          <span class="row-value">${valStr}</span>
        </div>
      `;
    };

    let sectionsHtml = "";

    if (item.gender === "women") {
      sectionsHtml = `
        <div class="section">
          <div class="section-header">👤 Personal Profile</div>
          <div class="section-content">
            ${renderRow("🪪", "Name", item.name)}
            ${renderRow("🎂", "Age", item.age ? item.age + " yrs" : "")}
            ${renderRow("📏", "Height", item.height)}
            ${renderRow("⚖️", "Weight", item.weight)}
            ${renderRow("🪞", "Body Type", item.body_type)}
          </div>
        </div>

        <div class="section">
          <div class="section-header">🏥 Health & Medical</div>
          <div class="section-content">
            ${renderRow("💊", "Conditions", item.health_conditions)}
            ${renderRow("🌸", "Periods", lifestyle.periodsRegular)}
            ${renderRow("📅", "Last Cycle Approx.", lifestyle.lastCycleDate)}
            ${renderRow("🤰", "Pregnancy History", lifestyle.pregnancyHistory)}
            ${renderRow("🧪", "Medicines / Supplements", lifestyle.medicines)}
            ${renderRow("😴", "Sleep Hours", lifestyle.sleep)}
            ${lifestyle.stress !== undefined ? renderRow("📈", "Stress Level", `${lifestyle.stress}/10`) : ""}
            ${renderRow("💧", "Water Intake", lifestyle.water)}
          </div>
        </div>

        <div class="section">
          <div class="section-header">🌙 Lifestyle & Diet</div>
          <div class="section-content">
            ${renderRow("💼", "Job / Role", lifestyle.job)}
            ${renderRow("🥗", "Food Preference", diet.food)}
            ${renderRow("🍽️", "Meals / Day", diet.meals)}
            ${renderRow("🍟", "Junk Habit", diet.junk)}
            ${renderRow("🌙", "Late Night Eating", diet.lateNight)}
            ${renderRow("🚫", "Food Dislikes", diet.dislikes)}
          </div>
        </div>

        <div class="section">
          <div class="section-header">💪 Fitness & Training</div>
          <div class="section-content">
            ${renderRow("🏅", "Experience", fitness.experience)}
            ${renderRow("🏃‍♀️", "Current Activity", fitness.activity)}
            ${renderRow("⏱️", "Time Available", fitness.time)}
            ${renderRow("📍", "Workout Place", fitness.place)}
          </div>
        </div>

        <div class="section">
          <div class="section-header">🎯 Goals</div>
          <div class="section-content">
            ${renderRow("🔥", "Main Goal", goals.main)}
            ${renderRow("📌", "Focus Area", goals.focus)}
            ${renderRow("📅", "1-Month Target", goals.target)}
            ${renderRow("💬", "Motivation", goals.why)}
          </div>
        </div>
      `;
    } else {
      sectionsHtml = `
        <div class="section">
          <div class="section-header">👤 Personal Profile</div>
          <div class="section-content">
            ${renderRow("🪪", "Name", item.name)}
            ${renderRow("🎂", "Age", item.age ? item.age + " yrs" : "")}
            ${renderRow("📏", "Height", item.height)}
            ${renderRow("⚖️", "Weight", item.weight)}
            ${renderRow("🪞", "Body Type", item.body_type)}
          </div>
        </div>

        <div class="section">
          <div class="section-header">❤️ Health & Lifestyle</div>
          <div class="section-content">
            ${renderRow("💊", "Conditions", item.health_conditions)}
            ${renderRow("🦵", "Joint Issues", lifestyle.jointIssues)}
            ${renderRow("🚬", "Smoking / Alcohol", lifestyle.smokingAlcohol)}
            ${renderRow("🧪", "Medicines / Supplements", lifestyle.medicines)}
          </div>
        </div>

        <div class="section">
          <div class="section-header">🏋️ Training History</div>
          <div class="section-content">
            ${renderRow("🏅", "Trained Before", fitness.experience)}
            ${renderRow("🚫", "Why Stopped", fitness.whyStopped)}
            ${renderRow("⚡", "Activity Level", fitness.activity)}
            ${renderRow("🏃", "Previous Activity", fitness.previousActivity)}
          </div>
        </div>

        <div class="section">
          <div class="section-header">💼 Lifestyle & Diet</div>
          <div class="section-content">
            ${renderRow("🖥️", "Job Type", lifestyle.job)}
            ${renderRow("⏰", "Work Hours", lifestyle.workHours)}
            ${renderRow("🍱", "Outside Food", lifestyle.outsideFood)}
            ${renderRow("🥗", "Food Preference", diet.food)}
            ${renderRow("🍽️", "Meals / Day", diet.meals)}
            ${renderRow("🍟", "Junk Habit", diet.junk)}
            ${renderRow("💊", "Supplements", diet.supplements)}
            ${renderRow("🚫", "Food Dislikes", diet.dislikes)}
          </div>
        </div>

        <div class="section">
          <div class="section-header">🎯 Goals</div>
          <div class="section-content">
            ${renderRow("🔥", "Primary Goal", goals.main)}
            ${renderRow("📌", "Secondary Goals", goals.focus)}
            ${renderRow("📅", "1-Month Target", goals.target)}
            ${renderRow("🏆", "Sport Target", goals.sportTarget)}
            ${renderRow("💬", "Motivation", goals.why)}
          </div>
        </div>
      `;
    }

    const html = `
      <html>
        <head>
          <title>Sandy.Lifts - Client Profile (${item.name})</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1f2937; background: #fff; margin: 40px; line-height: 1.5; }
            .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 20px; font-weight: 900; color: #111827; letter-spacing: 0.05em; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .badge-women { background: #fce7f3; color: #db2777; }
            .badge-men { background: #dbeafe; color: #2563eb; }
            .client-name { font-size: 24px; font-weight: 800; color: #111827; margin: 0 0 4px 0; }
            .client-meta { font-size: 13px; color: #4b5563; font-weight: 500; }
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            .section-header { display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; background: ${highlightColor}; color: ${titleColor}; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
            .section-content { padding: 0 8px; }
            .row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
            .row-label { display: flex; align-items: center; gap: 8px; color: #4b5563; font-weight: 500; }
            .row-value { color: #111827; font-weight: 600; text-align: right; max-width: 65%; }
            .comments-box { background: #f9fafb; border: 1px dashed #e5e7eb; border-radius: 8px; padding: 12px; font-size: 13px; font-style: italic; color: #374151; line-height: 1.45; }
            .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 10px; color: #9ca3af; }
            @media print {
              body { margin: 20px; }
              @page { size: A4; margin: 12mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="client-name">${item.name}</h1>
              <div class="client-meta">Assessment Form • ${item.gender === 'women' ? "Women's Fitness" : "Men's Fitness"}</div>
            </div>
            <div style="text-align: right;">
              <span class="logo">SANDY.LIFTS</span><br/>
              <span class="badge ${item.gender === 'women' ? 'badge-women' : 'badge-men'}">${item.gender === 'women' ? '🩷 Women' : '💪 Men'}</span>
            </div>
          </div>

          ${sectionsHtml}

          ${item.comments ? `
            <div class="section">
              <div class="section-header">📝 Additional Comments</div>
              <div class="comments-box">
                "${item.comments}"
              </div>
            </div>
          ` : ""}

          <div class="footer">
            <p>Generated automatically via Sandy.Lifts Admin Portal. &copy; ${new Date().getFullYear()} Sandy.Lifts. All rights reserved.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
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
            {selected && (() => {
              const lifestyle = parseJSON(selected.lifestyle);
              const diet = parseJSON(selected.diet);
              const fitness = parseJSON(selected.fitness);
              const goals = parseJSON(selected.goals);

              const softColor = selected.gender === "women" ? "#E8D0CE" : "#C3FCFE";
              const sectionBg = selected.gender === "women" ? "rgba(255,107,157,0.05)" : "rgba(77,163,255,0.05)";
              const borderCol = selected.gender === "women" ? "rgba(255,107,157,0.15)" : "rgba(77,163,255,0.15)";

              const Section = ({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) => (
                <div style={{ marginBottom:"1rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.45rem 0.75rem", borderRadius:"8px", background: sectionBg, border:`1px solid ${borderCol}`, marginBottom:"0.35rem" }}>
                    <span style={{ fontSize:"0.85rem" }}>{emoji}</span>
                    <span style={{ fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color: softColor }}>{title}</span>
                  </div>
                  <div style={{ padding:"0.1rem 0.5rem" }}>{children}</div>
                </div>
              );

              const Row = ({ icon, label, value }: { icon: string; label: string; value: any }) => {
                const valStr = Array.isArray(value) ? value.join(", ") : value;
                if (!valStr || valStr === "None" || valStr === "[]") return null;
                return (
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", padding:"0.5rem 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:"0.8rem" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:"0.45rem", color:"#8B909E", flexShrink:0, fontSize:"0.78rem" }}>
                      <span>{icon}</span>{label}
                    </span>
                    <span style={{ color:"#F5F7FA", fontWeight:600, textAlign:"right", maxWidth:"60%", lineHeight:1.3 }}>{valStr}</span>
                  </div>
                );
              };

              return (
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"1.25rem", position:"sticky", top:"90px", maxHeight:"calc(100vh - 120px)", overflowY:"auto" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:"1rem" }}>
                    <div>
                      <p style={{ margin:0, fontSize:"1.1rem", fontWeight:700, color:"#F5F7FA" }}>{selected.name}</p>
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

                  {/* Action Grid: WhatsApp & Download PDF */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginBottom:"1.25rem" }}>
                    <a href={`https://wa.me/918968244407?text=${encodeURIComponent(`Hi ${selected.name||""}! Sandy from Sandy.Lifts here. Your personalised plan is ready 🎉\n\nAlso, please take a moment to explore the app again! There is so much more built just for you. Thank you so much! 🙏✨`)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display:"flex", alignItems:"center", justifySelf:"stretch", justifyContent:"center", gap:"0.4rem", padding:"0.75rem", borderRadius:"10px", background:"rgba(37,211,102,0.1)", border:"1px solid rgba(37,211,102,0.3)", color:"#25D366", textDecoration:"none", fontSize:"0.82rem", fontWeight:600 }}>
                      💬 WhatsApp
                    </a>
                    
                    <button type="button" onClick={() => downloadPDF(selected)}
                      style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem", padding:"0.75rem", borderRadius:"10px", background:"rgba(77,163,255,0.1)", border:"1px solid rgba(77,163,255,0.3)", color:"#4DA3FF", cursor:"pointer", fontSize:"0.82rem", fontWeight:600 }}>
                      📥 Download PDF
                    </button>
                  </div>

                  {/* Render Data Sheet matching Gender Form */}
                  {selected.gender === "women" ? (
                    <div>
                      <Section emoji="👤" title="Personal Profile">
                        <Row icon="🪪" label="Name" value={selected.name} />
                        <Row icon="🎂" label="Age" value={selected.age ? selected.age + " yrs" : ""} />
                        <Row icon="📏" label="Height" value={selected.height} />
                        <Row icon="⚖️" label="Weight" value={selected.weight} />
                        <Row icon="🪞" label="Body Type" value={selected.body_type} />
                      </Section>
                      <Section emoji="🏥" title="Health & Medical">
                        <Row icon="💊" label="Conditions" value={selected.health_conditions} />
                        <Row icon="🌸" label="Periods" value={lifestyle.periodsRegular} />
                        {lifestyle.lastCycleDate && <Row icon="📅" label="Last Cycle Approx." value={lifestyle.lastCycleDate} />}
                        <Row icon="🤰" label="Pregnancy History" value={lifestyle.pregnancyHistory} />
                        <Row icon="🧪" label="Medicines / Supplements" value={lifestyle.medicines} />
                        <Row icon="😴" label="Sleep Hours" value={lifestyle.sleep} />
                        {lifestyle.stress !== undefined && <Row icon="📈" label="Stress Level" value={`${lifestyle.stress}/10`} />}
                        <Row icon="💧" label="Water Intake" value={lifestyle.water} />
                      </Section>
                      <Section emoji="🌙" title="Lifestyle & Diet">
                        <Row icon="💼" label="Job / Role" value={lifestyle.job} />
                        <Row icon="🥗" label="Food Preference" value={diet.food} />
                        <Row icon="🍽️" label="Meals / Day" value={diet.meals} />
                        <Row icon="🍟" label="Junk Habit" value={diet.junk} />
                        <Row icon="🌙" label="Late Night Eating" value={diet.lateNight} />
                        <Row icon="🚫" label="Food Dislikes" value={diet.dislikes} />
                      </Section>
                      <Section emoji="💪" title="Fitness & Training">
                        <Row icon="🏅" label="Experience" value={fitness.experience} />
                        <Row icon="🏃‍♀️" label="Current Activity" value={fitness.activity} />
                        <Row icon="⏱️" label="Time Available" value={fitness.time} />
                        <Row icon="📍" label="Workout Place" value={fitness.place} />
                      </Section>
                      <Section emoji="🎯" title="Goals">
                        <Row icon="🔥" label="Main Goal" value={goals.main} />
                        <Row icon="📌" label="Focus Area" value={goals.focus} />
                        <Row icon="📅" label="1-Month Target" value={goals.target} />
                        <Row icon="💬" label="Motivation" value={goals.why} />
                      </Section>
                    </div>
                  ) : (
                    <div>
                      <Section emoji="👤" title="Personal Profile">
                        <Row icon="🪪" label="Name" value={selected.name} />
                        <Row icon="🎂" label="Age" value={selected.age ? selected.age + " yrs" : ""} />
                        <Row icon="📏" label="Height" value={selected.height} />
                        <Row icon="⚖️" label="Weight" value={selected.weight} />
                        <Row icon="🪞" label="Body Type" value={selected.body_type} />
                      </Section>
                      <Section emoji="❤️" title="Health & Lifestyle">
                        <Row icon="💊" label="Conditions" value={selected.health_conditions} />
                        <Row icon="🦵" label="Joint Issues" value={lifestyle.jointIssues} />
                        <Row icon="🚬" label="Smoking / Alcohol" value={lifestyle.smokingAlcohol} />
                        <Row icon="🧪" label="Medicines / Supplements" value={lifestyle.medicines} />
                      </Section>
                      <Section emoji="🏋️" title="Training History">
                        <Row icon="🏅" label="Trained Before" value={fitness.experience} />
                        {fitness.whyStopped && <Row icon="🚫" label="Why Stopped" value={fitness.whyStopped} />}
                        <Row icon="⚡" label="Activity Level" value={fitness.activity} />
                        <Row icon="🏃" label="Previous Activity" value={fitness.previousActivity} />
                      </Section>
                      <Section emoji="💼" title="Lifestyle & Diet">
                        <Row icon="🖥️" label="Job Type" value={lifestyle.job} />
                        <Row icon="⏰" label="Work Hours" value={lifestyle.workHours} />
                        <Row icon="🍱" label="Outside Food" value={lifestyle.outsideFood} />
                        <Row icon="🥗" label="Food Preference" value={diet.food} />
                        <Row icon="🍽️" label="Meals / Day" value={diet.meals} />
                        <Row icon="🍟" label="Junk Habit" value={diet.junk} />
                        <Row icon="💊" label="Supplements" value={diet.supplements} />
                        <Row icon="🚫" label="Food Dislikes" value={diet.dislikes} />
                      </Section>
                      <Section emoji="🎯" title="Goals">
                        <Row icon="🔥" label="Primary Goal" value={goals.main} />
                        <Row icon="📌" label="Secondary Goals" value={goals.focus} />
                        <Row icon="📅" label="1-Month Target" value={goals.target} />
                        <Row icon="🏆" label="Sport Target" value={goals.sportTarget} />
                        <Row icon="💬" label="Motivation" value={goals.why} />
                      </Section>
                    </div>
                  )}

                  {selected.comments && (
                    <Section emoji="📝" title="Additional Comments">
                      <p style={{ margin:0, fontSize:"0.82rem", color:"#D8DBFC", fontStyle:"italic", lineHeight:1.4 }}>
                        &ldquo;{selected.comments}&rdquo;
                      </p>
                    </Section>
                  )}

                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"0.75rem", fontSize:"0.72rem", color:"#52525B", display:"flex", justifyContent:"space-between" }}>
                    <span>ID: {selected.id}</span>
                    <span>{new Date(selected.created_at).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
