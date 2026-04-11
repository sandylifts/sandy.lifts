"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Plus, Trash2 } from "lucide-react";

interface Entry { date: string; weight: number; }

export default function ProgressChartPage() {
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sl-progress");
      return saved ? JSON.parse(saved) : [
        { date: "2025-01-01", weight: 82 },
        { date: "2025-01-08", weight: 81.2 },
        { date: "2025-01-15", weight: 80.5 },
        { date: "2025-01-22", weight: 79.8 },
        { date: "2025-01-29", weight: 79.1 },
      ];
    }
    return [];
  });
  const [newDate, setNewDate] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("sl-progress", JSON.stringify(entries));
    drawChart();
  }, [entries]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || entries.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const weights = sorted.map(e => e.weight);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const pad = { t: 30, b: 50, l: 50, r: 20 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;

    // Grid
    ctx.strokeStyle = "rgba(195,252,254,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
      const val = Math.round((maxW - (maxW - minW) * (i / 4)) * 10) / 10;
      ctx.fillStyle = "rgba(155,155,180,0.6)";
      ctx.font = "11px Outfit, sans-serif";
      ctx.fillText(val.toString(), 4, y + 4);
    }

    if (sorted.length < 2) return;

    // Gradient area
    const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
    grad.addColorStop(0, "rgba(195,252,254,0.2)");
    grad.addColorStop(1, "rgba(195,252,254,0)");

    const getX = (i: number) => pad.l + (i / (sorted.length - 1)) * chartW;
    const getY = (w: number) => pad.t + ((maxW - w) / (maxW - minW)) * chartH;

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(sorted[0].weight));
    sorted.forEach((e, i) => { if (i > 0) ctx.lineTo(getX(i), getY(e.weight)); });
    ctx.lineTo(getX(sorted.length - 1), H - pad.b);
    ctx.lineTo(pad.l, H - pad.b);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(sorted[0].weight));
    sorted.forEach((e, i) => { if (i > 0) ctx.lineTo(getX(i), getY(e.weight)); });
    ctx.strokeStyle = "#C3FCFE";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Dots
    sorted.forEach((e, i) => {
      ctx.beginPath();
      ctx.arc(getX(i), getY(e.weight), 5, 0, Math.PI * 2);
      ctx.fillStyle = "#C3FCFE";
      ctx.fill();
      // X labels
      ctx.fillStyle = "rgba(155,155,180,0.6)";
      ctx.font = "10px Outfit, sans-serif";
      ctx.fillText(e.date.slice(5), getX(i) - 14, H - 10);
    });
  };

  const addEntry = () => {
    if (!newDate || !newWeight) return;
    setEntries(prev => [...prev.filter(e => e.date !== newDate), { date: newDate, weight: parseFloat(newWeight) }]);
    setNewDate(""); setNewWeight("");
  };

  const trend = entries.length >= 2 ? (() => {
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const diff = sorted[sorted.length - 1].weight - sorted[0].weight;
    return { diff: Math.round(diff * 10) / 10, positive: diff < 0 };
  })() : null;

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#6B6F9A", textDecoration: "none", marginBottom: "2rem", fontSize: "0.875rem" }}>
          <ArrowLeft size={15} /> Back to Tools Hub
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(195,252,254,0.1)", border: "1px solid rgba(195,252,254,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={24} color="#C3FCFE" />
          </div>
          <h1 style={{ color: "#D8DBFC", fontWeight: 800, fontSize: "1.75rem", margin: 0 }}>Live Progress Chart</h1>
        </div>
        <p style={{ color: "#9A9EC4", lineHeight: 1.7, marginBottom: "2rem" }}>Log your weight over time and visualise your journey. Data saved locally in your browser.</p>

        {/* Chart */}
        <div style={{ background: "#343553", borderRadius: "24px", padding: "1.5rem", border: "1px solid rgba(195,252,254,0.1)", marginBottom: "1.5rem" }}>
          {trend && (
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(5,5,11,0.4)", borderRadius: "10px", padding: "0.625rem 1rem", color: trend.positive ? "#C3FCFE" : "#FF6B6B", fontWeight: 700 }}>
                {trend.positive ? "▼" : "▲"} {Math.abs(trend.diff)} kg {trend.positive ? "lost" : "gained"}
              </div>
              <div style={{ background: "rgba(5,5,11,0.4)", borderRadius: "10px", padding: "0.625rem 1rem", color: "#6B6F9A", fontSize: "0.85rem" }}>
                {entries.length} entries logged
              </div>
            </div>
          )}
          <canvas ref={canvasRef} width={700} height={280} style={{ width: "100%", height: "auto", display: "block" }} />
        </div>

        {/* Add entry */}
        <div style={{ background: "#343553", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(195,252,254,0.1)", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#D8DBFC", fontWeight: 700, marginBottom: "1rem" }}>Log a new entry</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", alignItems: "end" }}>
            <div>
              <label style={{ color: "#9A9EC4", fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Date</label>
              <input className="input-field" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
            </div>
            <div>
              <label style={{ color: "#9A9EC4", fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Weight (kg)</label>
              <input className="input-field" type="number" step="0.1" placeholder="e.g. 80.5" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={addEntry} style={{ padding: "0.75rem", flexShrink: 0 }}>
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Entries list */}
        <div style={{ background: "#343553", borderRadius: "20px", padding: "1.5rem", border: "1px solid rgba(195,252,254,0.1)" }}>
          <h3 style={{ color: "#D8DBFC", fontWeight: 700, marginBottom: "1rem" }}>Your entries</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "280px", overflowY: "auto" }}>
            {[...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
              <div key={entry.date} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 0.875rem", background: "rgba(34,34,53,0.6)", borderRadius: "8px" }}>
                <span style={{ color: "#9A9EC4", fontSize: "0.875rem" }}>{entry.date}</span>
                <span style={{ color: "#C3FCFE", fontWeight: 700 }}>{entry.weight} kg</span>
                <button onClick={() => setEntries(prev => prev.filter(e => e.date !== entry.date))} style={{ background: "none", border: "none", color: "#6B6F9A", cursor: "pointer", padding: "0.25rem" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
