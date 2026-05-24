"use client";
import { useState, useEffect, useMemo } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Submission {
  id: string; created_at: string; gender: string; name: string; age: string;
  height: string; weight: string; body_type: string; health_conditions: string;
  lifestyle?: string; diet?: string; fitness?: string;
  goals: string; comments: string; status: string;
}

type PaymentStatus = "Paid" | "Pending" | "Refunded";
type PlanTier = "Platinum Coach" | "Gold Plan" | "Silver Plan" | "Bronze Starter";

interface PaymentRecord {
  submissionId: string;
  plan: PlanTier;
  amount: number;
  status: PaymentStatus;
  date: string;
}

type ActiveTab = "overview" | "submissions" | "payments" | "sponsorship";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const parseJSON = (str?: string): Record<string, any> => {
  if (!str) return {};
  try { return JSON.parse(str); } catch { return {}; }
};

const PLANS: PlanTier[] = ["Platinum Coach", "Gold Plan", "Silver Plan", "Bronze Starter"];
const PLAN_PRICES: Record<PlanTier, number> = {
  "Platinum Coach": 14999,
  "Gold Plan": 9999,
  "Silver Plan": 5999,
  "Bronze Starter": 2999,
};
const PLAN_COLORS: Record<PlanTier, string> = {
  "Platinum Coach": "#E5CCFF",
  "Gold Plan": "#FFD700",
  "Silver Plan": "#C0C0C0",
  "Bronze Starter": "#CD7F32",
};

function generatePaymentRecord(sub: Submission, index: number): PaymentRecord {
  const seed = sub.id.charCodeAt(0) + sub.id.charCodeAt(sub.id.length - 1) + index;
  const planIndex = seed % 4;
  const plan = PLANS[planIndex];
  const statuses: PaymentStatus[] = ["Paid", "Paid", "Paid", "Pending", "Refunded"];
  const status = statuses[seed % 5];
  const dayOffset = (seed * 7) % 30;
  const date = new Date(sub.created_at);
  date.setDate(date.getDate() + dayOffset);
  return {
    submissionId: sub.id,
    plan,
    amount: PLAN_PRICES[plan],
    status,
    date: date.toISOString(),
  };
}

/* ─── Micro SVG Chart Components ─────────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle cx={pts.split(" ").pop()?.split(",")[0]} cy={pts.split(" ").pop()?.split(",")[1]} r="3" fill={color} />
    </svg>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 52, cx = 60, cy = 60, strokeW = 12;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.value / total) * circumference;
    const arc = { dash, offset, seg };
    offset += dash;
    return arc;
  });
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeW} />
      {arcs.map(({ dash, offset: off, seg }, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={seg.color} strokeWidth={strokeW} strokeDasharray={`${dash - 2} ${circumference - dash + 2}`}
          strokeDashoffset={-off + circumference * 0.25}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease", filter: `drop-shadow(0 0 6px ${seg.color}60)` }} />
      ))}
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#F5F7FA" fontSize="13" fontWeight="800" fontFamily="Outfit, sans-serif">
        {total}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#8B909E" fontSize="8" fontFamily="Outfit, sans-serif">
        CLIENTS
      </text>
    </svg>
  );
}

function RevenueLineChart({ data }: { data: { label: string; value: number }[] }) {
  if (data.length < 2) return <div style={{ color: "#52525B", fontSize: "0.8rem", padding: "2rem", textAlign: "center" }}>Not enough data</div>;
  const max = Math.max(...data.map(d => d.value)) || 1;
  const W = 520, H = 120, pad = 10;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((d.value / max) * (H - pad * 2));
    return { x, y, ...d };
  });
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${pts[pts.length - 1].x},${H - pad} L${pts[0].x},${H - pad} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: "visible" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00F2FE" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7F00FF" />
          <stop offset="100%" stopColor="#00F2FE" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#revGrad)" />
      <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 8px rgba(0,242,254,0.5))" }} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#00F2FE" style={{ filter: "drop-shadow(0 0 4px #00F2FE)" }} />
          <text x={p.x} y={H + 18} textAnchor="middle" fill="#52525B" fontSize="9" fontFamily="Outfit, sans-serif">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function FunnelChart({ total, reviewed, paid }: { total: number; reviewed: number; paid: number }) {
  const stages = [
    { label: "Submissions", value: total, color: "#7F00FF", pct: 100 },
    { label: "Reviewed", value: reviewed, color: "#00F2FE", pct: total ? Math.round((reviewed / total) * 100) : 0 },
    { label: "Paid", value: paid, color: "#00F5A0", pct: total ? Math.round((paid / total) * 100) : 0 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", width: "100%" }}>
      {stages.map((s, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#8B909E", fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: "0.75rem", color: s.color, fontWeight: 700 }}>{s.value} <span style={{ color: "#52525B" }}>({s.pct}%)</span></span>
          </div>
          <div style={{ height: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}99, ${s.color})`, borderRadius: "4px", transition: "width 1s ease", boxShadow: `0 0 8px ${s.color}60` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── KPI Card ───────────────────────────────────────────────────────────── */
function KPICard({ icon, label, value, sub, sparkData, color, trend }: {
  icon: string; label: string; value: string; sub: string;
  sparkData?: number[]; color: string; trend?: "up" | "down" | "neutral";
}) {
  const trendColor = trend === "up" ? "#00F5A0" : trend === "down" ? "#FF007F" : "#8B909E";
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  return (
    <div style={{
      background: "rgba(13,14,22,0.8)", border: `1px solid ${color}25`,
      borderRadius: "16px", padding: "1.25rem", position: "relative", overflow: "hidden",
      transition: "all 0.3s ease",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}60`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${color}20`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}25`; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: `radial-gradient(circle at top right, ${color}12, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{icon}</div>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525B" }}>{label}</div>
        </div>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
      <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#F5F7FA", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: trendColor, fontWeight: 600 }}>
        {trend && <span>{trendIcon} </span>}{sub}
      </div>
    </div>
  );
}

/* ─── PDF Generator (preserved from original) ───────────────────────────── */
function downloadPDF(item: Submission) {
  const lifestyle = parseJSON(item.lifestyle);
  const diet = parseJSON(item.diet);
  const fitness = parseJSON(item.fitness);
  const goals = parseJSON(item.goals);
  const printWindow = window.open("", "_blank");
  if (!printWindow) { alert("Please allow popups."); return; }
  const titleColor = item.gender === "women" ? "#db2777" : "#2563eb";
  const highlightColor = item.gender === "women" ? "#fce7f3" : "#dbeafe";
  const renderRow = (icon: string, label: string, value: any) => {
    const valStr = Array.isArray(value) ? value.join(", ") : value;
    if (!valStr || valStr === "None" || valStr === "[]") return "";
    return `<div class="row"><span class="row-label"><span>${icon}</span> ${label}</span><span class="row-value">${valStr}</span></div>`;
  };
  const html = `<html><head><title>Sandy.Lifts — ${item.name}</title>
  <style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1f2937;margin:40px;line-height:1.5}
  .header{border-bottom:2px solid #e5e7eb;padding-bottom:20px;margin-bottom:25px;display:flex;justify-content:space-between;align-items:center}
  .logo{font-size:20px;font-weight:900;color:#111827}.client-name{font-size:24px;font-weight:800;margin:0 0 4px}
  .badge{display:inline-block;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:700;text-transform:uppercase}
  .badge-women{background:#fce7f3;color:#db2777}.badge-men{background:#dbeafe;color:#2563eb}
  .section{margin-bottom:20px;page-break-inside:avoid}
  .section-header{display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:6px;background:${highlightColor};color:${titleColor};font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px}
  .row-label{color:#4b5563;font-weight:500}.row-value{color:#111827;font-weight:600;text-align:right;max-width:65%}
  .footer{margin-top:40px;border-top:1px solid #e5e7eb;padding-top:15px;text-align:center;font-size:10px;color:#9ca3af}
  @media print{body{margin:20px}@page{size:A4;margin:12mm}}</style></head>
  <body><div class="header"><div><h1 class="client-name">${item.name}</h1><div style="font-size:13px;color:#4b5563">${item.gender === "women" ? "Women's Fitness" : "Men's Fitness"} Assessment</div></div>
  <div style="text-align:right"><span class="logo">SANDY.LIFTS</span><br/><span class="badge ${item.gender === "women" ? "badge-women" : "badge-men"}">${item.gender === "women" ? "🩷 Women" : "💪 Men"}</span></div></div>
  <div class="section"><div class="section-header">👤 Personal Profile</div>${renderRow("🪪", "Name", item.name)}${renderRow("🎂", "Age", item.age ? item.age + " yrs" : "")}${renderRow("📏", "Height", item.height)}${renderRow("⚖️", "Weight", item.weight)}${renderRow("🪞", "Body Type", item.body_type)}</div>
  ${item.comments ? `<div class="section"><div class="section-header">📝 Comments</div><p style="font-style:italic">"${item.comments}"</p></div>` : ""}
  <div class="footer"><p>Generated by Sandy.Lifts Admin © ${new Date().getFullYear()}</p></div>
  <script>window.onload=function(){window.print();setTimeout(()=>window.close(),500)}<\/script></body></html>`;
  printWindow.document.open(); printWindow.document.write(html); printWindow.document.close();
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
export function AdminDashboard({ password = "" }: { password?: string }) {
  const [rows, setRows]           = useState<Submission[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<Submission | null>(null);
  const [error, setError]         = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "women" | "men">("all");
  const [statusFilter, setStatusFilter] = useState("All");
  const [payFilter, setPayFilter] = useState<"all" | PaymentStatus>("all");
  const [payments, setPayments]   = useState<Record<string, PaymentRecord>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Collapse sidebar by default on mobile, expand on desktop
      setSidebarOpen(!mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/api/admin/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.error) { setError(res.error); }
        else {
          const data: Submission[] = res.data || [];
          setRows(data);
          // Generate mock payment records
          const pm: Record<string, PaymentRecord> = {};
          data.forEach((sub, i) => { pm[sub.id] = generatePaymentRecord(sub, i); });
          setPayments(pm);
        }
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [password]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "update", id, status }),
      });
      const data = await res.json();
      if (data.error) { alert("Failed: " + data.error); return; }
      setRows(r => r.map(x => x.id === id ? { ...x, status } : x));
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : null);
    } catch (err: any) { alert("Error: " + err.message); }
  };

  const updatePayment = (id: string, updates: Partial<PaymentRecord>) => {
    setPayments(p => ({ ...p, [id]: { ...p[id], ...updates } }));
  };

  /* ── Derived Analytics ── */
  const allPayments = useMemo(() => Object.values(payments), [payments]);
  const paidPayments = useMemo(() => allPayments.filter(p => p.status === "Paid"), [allPayments]);
  const totalRevenue = useMemo(() => paidPayments.reduce((s, p) => s + p.amount, 0), [paidPayments]);
  const pendingCount = useMemo(() => allPayments.filter(p => p.status === "Pending").length, [allPayments]);
  const conversionRate = useMemo(() => rows.length ? Math.round((paidPayments.length / rows.length) * 100) : 0, [rows, paidPayments]);

  // Weekly revenue for sparkline (last 7 weeks simulated)
  const revenueSparkline = useMemo(() => {
    const base = totalRevenue / 7;
    return [0.6, 0.8, 0.5, 0.9, 0.7, 1.1, 1.0].map(m => Math.round(base * m));
  }, [totalRevenue]);

  // Monthly revenue chart data
  const monthlyRevenue = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((label, i) => ({
      label,
      value: Math.round(totalRevenue * [0.5, 0.65, 0.8, 0.9, 0.75, 1.0][i] / 6),
    }));
  }, [totalRevenue]);

  // Goal distribution
  const goalDist = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach(r => {
      const goal = parseJSON(r.goals).main || "Other";
      counts[goal] = (counts[goal] || 0) + 1;
    });
    const colors = ["#00F2FE", "#7F00FF", "#FF007F", "#00F5A0", "#FFD700"];
    return Object.entries(counts).slice(0, 5).map(([label, value], i) => ({
      label, value, color: colors[i % colors.length],
    }));
  }, [rows]);

  /* ── Filtered Submissions ── */
  const filteredSubmissions = useMemo(() => {
    return rows.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || r.name?.toLowerCase().includes(q) ||
        (parseJSON(r.goals).main || "").toLowerCase().includes(q);
      const matchesGender = genderFilter === "all" || r.gender === genderFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const pay = payments[r.id];
      const matchesPay = payFilter === "all" || (pay && pay.status === payFilter);
      return matchesSearch && matchesGender && matchesStatus && matchesPay;
    });
  }, [rows, searchQuery, genderFilter, statusFilter, payFilter, payments]);

  /* ── Filtered Payment rows ── */
  const filteredPayments = useMemo(() => {
    return rows.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || r.name?.toLowerCase().includes(q);
      const pay = payments[r.id];
      const matchesPay = payFilter === "all" || (pay && pay.status === payFilter);
      return matchesSearch && matchesPay;
    });
  }, [rows, searchQuery, payFilter, payments]);

  /* ── Styles ── */
  const S = {
    sidebar: {
      width: sidebarOpen ? "220px" : "64px",
      minHeight: "100vh",
      background: "rgba(7,8,14,0.95)",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex" as const,
      flexDirection: "column" as const,
      paddingTop: "2rem",
      transition: "width 0.3s ease",
      flexShrink: 0,
    },
    main: {
      flex: 1,
      minWidth: 0,
      background: "#07080E",
      minHeight: "100vh",
      overflowX: "hidden" as const,
    },
    card: {
      background: "rgba(13,14,22,0.8)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "16px",
      padding: "1.5rem",
    },
  };

  const navItems: { id: ActiveTab; icon: string; label: string }[] = [
    { id: "overview", icon: "◈", label: "Overview" },
    { id: "submissions", icon: "⊞", label: "Submissions" },
    { id: "payments", icon: "◎", label: "Payments" },
    { id: "sponsorship", icon: "★", label: "Media Kit" },
  ];

  /* ──────────────────────────────────────────────────────────────────────── */
  const mobileSidebarStyle = isMobile ? {
    position: "fixed" as const,
    top: 0,
    left: sidebarOpen ? 0 : "-240px",
    width: "240px",
    height: "100vh",
    zIndex: 100,
    background: "rgba(7,8,14,0.98)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column" as const,
    paddingTop: "2rem",
    transition: "left 0.3s ease",
    boxShadow: "10px 0 40px rgba(0,0,0,0.8)",
    flexShrink: 0
  } : S.sidebar;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#07080E", fontFamily: "'Outfit', 'Inter', sans-serif", position: "relative" }}>

      {/* Mobile Sidebar Click-Away Overlay Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 90
          }} 
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={mobileSidebarStyle}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? "0 1.25rem 2rem" : "0 0.75rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1rem" }}>
          {sidebarOpen ? (
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#00F2FE", marginBottom: "0.25rem" }}>Sandy.Lifts</div>
              <div style={{ fontSize: "0.75rem", color: "#52525B", fontWeight: 600 }}>Admin Command Center</div>
            </div>
          ) : (
            <div style={{ textAlign: "center", fontSize: "1.2rem" }}>⚡</div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: (sidebarOpen || isMobile) ? "0 0.75rem" : "0 0.5rem" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSelected(null); if (isMobile) setSidebarOpen(false); }}
              title={item.label}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                padding: sidebarOpen ? "0.7rem 0.875rem" : "0.7rem",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                borderRadius: "10px", border: "none", cursor: "pointer",
                marginBottom: "0.25rem",
                background: activeTab === item.id ? "rgba(0,242,254,0.08)" : "transparent",
                color: activeTab === item.id ? "#00F2FE" : "#52525B",
                fontSize: activeTab === item.id ? "0.85rem" : "0.85rem",
                fontWeight: activeTab === item.id ? 700 : 500,
                transition: "all 0.2s ease",
                outline: "none",
                borderLeft: activeTab === item.id ? "2px solid #00F2FE" : "2px solid transparent",
              }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button onClick={() => setSidebarOpen(o => !o)}
          style={{ margin: "1rem 0.75rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#52525B", cursor: "pointer", fontSize: "0.75rem", transition: "all 0.2s ease" }}>
          {sidebarOpen ? "◀ Collapse" : "▶"}
        </button>
      </aside>

      {/* ── Main Area ───────────────────────────────────────────────────── */}
      <main style={S.main}>

        {/* Top Bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,8,14,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: isMobile ? "0.875rem 1rem" : "0.875rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(o => !o)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#00F2FE",
                  fontSize: "1.1rem",
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer",
                  marginRight: "0.75rem",
                  outline: "none",
                  boxShadow: "0 0 10px rgba(0,242,254,0.1)"
                }}
              >
                ☰
              </button>
            )}
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#00F2FE" }}>
                {activeTab === "overview" ? "Analytics Overview" : activeTab === "submissions" ? "Client Intake CRM" : activeTab === "payments" ? "Payment Hub" : "Brands Sponsorship Portal"}
              </div>
              <div style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", fontWeight: 800, color: "#F5F7FA", marginTop: "0.1rem" }}>
                {activeTab === "overview" ? "Command Center" : activeTab === "submissions" ? `${rows.length} Submissions` : activeTab === "payments" ? `Revenue Tracker` : `MuscleBlaze & Brand Pitch`}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#52525B", background: "rgba(0,242,254,0.06)", border: "1px solid rgba(0,242,254,0.1)", borderRadius: "8px", padding: "0.4rem 0.75rem" }}>
              🟢 Live
            </div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #00F2FE, #7F00FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: "#07080E" }}>S</div>
          </div>
        </div>

        <div style={{ padding: isMobile ? "1rem" : "2rem" }}>

          {/* ══ OVERVIEW TAB ══════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div>
              {/* KPI Grid */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <KPICard icon="💰" label="Total Revenue (MRR)" color="#00F2FE"
                  value={`₹${totalRevenue.toLocaleString("en-IN")}`}
                  sub={`${paidPayments.length} paid clients`} trend="up"
                  sparkData={revenueSparkline} />
                <KPICard icon="📋" label="Intake Submissions" color="#7F00FF"
                  value={`${rows.length}`}
                  sub={`+${Math.max(0, rows.length - Math.floor(rows.length * 0.85))} this week`} trend="up"
                  sparkData={[3, 5, 4, 8, 6, rows.length > 0 ? rows.length : 1]} />
                <KPICard icon="⚡" label="Conversion Rate" color="#00F5A0"
                  value={`${conversionRate}%`}
                  sub="Form → Paid Program" trend={conversionRate > 50 ? "up" : "neutral"}
                  sparkData={[40, 45, 38, 55, 60, conversionRate]} />
                <KPICard icon="⏳" label="Pending Review" color="#FF007F"
                  value={`${rows.filter(r => r.status === "New").length}`}
                  sub={`${pendingCount} pending payments`} trend={rows.filter(r => r.status === "New").length > 5 ? "down" : "neutral"} />
              </div>

              {/* Charts Row */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>

                {/* Revenue Chart */}
                <div style={{ ...S.card, gridColumn: isMobile ? "auto" : "1 / 2" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525B" }}>Revenue Trend</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F7FA" }}>Monthly Performance</div>
                  </div>
                  <RevenueLineChart data={monthlyRevenue} />
                </div>

                {/* Goals Donut */}
                <div style={{ ...S.card }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525B" }}>Goal Distribution</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F7FA" }}>Client Goals</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <DonutChart segments={goalDist.length > 0 ? goalDist : [{ label: "No data", value: 1, color: "#333" }]} />
                    <div style={{ flex: 1 }}>
                      {goalDist.slice(0, 5).map((seg, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: seg.color, boxShadow: `0 0 6px ${seg.color}` }} />
                          <span style={{ fontSize: "0.72rem", color: "#8B909E", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{seg.label}</span>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: seg.color }}>{seg.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Funnel + Plan Distribution */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                <div style={S.card}>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525B" }}>Pipeline</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F7FA" }}>Conversion Funnel</div>
                  </div>
                  <FunnelChart total={rows.length} reviewed={rows.filter(r => r.status !== "New").length} paid={paidPayments.length} />
                </div>

                <div style={S.card}>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525B" }}>Plan Breakdown</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F7FA" }}>Active Tiers</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {PLANS.map(plan => {
                      const count = allPayments.filter(p => p.plan === plan).length;
                      const rev = allPayments.filter(p => p.plan === plan && p.status === "Paid").reduce((s, p) => s + p.amount, 0);
                      return (
                        <div key={plan} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.875rem", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: PLAN_COLORS[plan] }} />
                            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#D8DBFC" }}>{plan}</span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: PLAN_COLORS[plan] }}>₹{rev.toLocaleString("en-IN")}</div>
                            <div style={{ fontSize: "0.65rem", color: "#52525B" }}>{count} clients</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Gender Split */}
              <div style={{ ...S.card, marginTop: "1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525B" }}>Demographics</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F7FA" }}>Gender Split</div>
                </div>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                  {[
                    { label: "Women 🩷", key: "women", color: "#FF6B9D" },
                    { label: "Men 💪", key: "men", color: "#4DA3FF" },
                  ].map(({ label, key, color }) => {
                    const count = rows.filter(r => r.gender === key).length;
                    const pct = rows.length ? Math.round((count / rows.length) * 100) : 0;
                    return (
                      <div key={key} style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                          <span style={{ fontSize: "0.8rem", color: "#8B909E", fontWeight: 600 }}>{label}</span>
                          <span style={{ fontSize: "0.8rem", fontWeight: 800, color }}>{count} <span style={{ color: "#52525B", fontWeight: 500 }}>({pct}%)</span></span>
                        </div>
                        <div style={{ height: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "5px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: "5px", transition: "width 1s ease", boxShadow: `0 0 10px ${color}60` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══ SUBMISSIONS TAB ═══════════════════════════════════════════ */}
          {activeTab === "submissions" && (
            <div>
              {/* Search & Filters */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center" }}>
                <div style={{ position: "relative", flex: "1 1 240px", minWidth: "200px" }}>
                  <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#52525B", fontSize: "0.85rem" }}>🔍</span>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name or goal…"
                    style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.25rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", color: "#F5F7FA", fontSize: "0.83rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                {/* Gender filter */}
                {(["all", "women", "men"] as const).map(g => (
                  <button key={g} onClick={() => setGenderFilter(g)}
                    style={{ padding: "0.5rem 1rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", border: `1px solid ${genderFilter === g ? "rgba(0,242,254,0.4)" : "rgba(255,255,255,0.07)"}`, background: genderFilter === g ? "rgba(0,242,254,0.08)" : "rgba(255,255,255,0.02)", color: genderFilter === g ? "#00F2FE" : "#52525B", transition: "all 0.2s" }}>
                    {g === "all" ? "All" : g === "women" ? "🩷 Women" : "💪 Men"}
                  </button>
                ))}
                {/* Status filter */}
                {["All", "New", "Reviewed", "Plan Sent"].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    style={{ padding: "0.5rem 1rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", border: `1px solid ${statusFilter === s ? "rgba(0,245,160,0.4)" : "rgba(255,255,255,0.07)"}`, background: statusFilter === s ? "rgba(0,245,160,0.08)" : "rgba(255,255,255,0.02)", color: statusFilter === s ? "#00F5A0" : "#52525B", transition: "all 0.2s" }}>
                    {s}
                  </button>
                ))}
              </div>

              {error && <div style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.25)", borderRadius: "12px", padding: "1rem", color: "#FF6B6B", fontSize: "0.83rem", marginBottom: "1.5rem" }}>⚠️ {error}</div>}

              {loading ? (
                <div style={{ textAlign: "center", padding: "5rem", color: "#52525B" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem", animation: "spin 1s linear infinite" }}>⟳</div>
                  <div>Loading submissions…</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 400px" : "1fr", gap: "1rem", alignItems: "start" }}>

                  {/* Table */}
                  <div style={{ background: "rgba(13,14,22,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
                    {filteredSubmissions.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "4rem", color: "#52525B" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📭</div>
                        <div>No submissions match your filters.</div>
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "rgba(0,0,0,0.4)" }}>
                              {["Client", "Gender", "Goal", "Plan", "Pay Status", "Date", "Status"].map(h => (
                                <th key={h} style={{ padding: "0.65rem 0.875rem", textAlign: "left", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525B", borderBottom: "1px solid rgba(255,255,255,0.05)", whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredSubmissions.map(row => {
                              const goal = (() => { try { return JSON.parse(row.goals)?.main || "—"; } catch { return "—"; } })();
                              const pay = payments[row.id];
                              const isSelected = selected?.id === row.id;
                              return (
                                <tr key={row.id} onClick={() => setSelected(isSelected ? null : row)}
                                  style={{ cursor: "pointer", background: isSelected ? "rgba(0,242,254,0.04)" : "transparent", transition: "background 0.15s" }}
                                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.02)"; }}
                                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}>
                                  <td style={{ padding: "0.7rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.03)", verticalAlign: "middle" }}>
                                    <div style={{ fontWeight: 700, color: "#F5F7FA", fontSize: "0.85rem" }}>{row.name || "—"}</div>
                                    <div style={{ fontSize: "0.68rem", color: "#52525B" }}>{row.age}y · {row.weight}kg</div>
                                  </td>
                                  <td style={{ padding: "0.7rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, background: row.gender === "women" ? "rgba(255,107,157,0.12)" : "rgba(77,163,255,0.12)", color: row.gender === "women" ? "#FF6B9D" : "#4DA3FF" }}>
                                      {row.gender === "women" ? "🩷 W" : "💪 M"}
                                    </span>
                                  </td>
                                  <td style={{ padding: "0.7rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "#D8DBFC", fontSize: "0.8rem", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{goal}</td>
                                  <td style={{ padding: "0.7rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    {pay && <span style={{ fontSize: "0.7rem", fontWeight: 700, color: PLAN_COLORS[pay.plan] }}>{pay.plan}</span>}
                                  </td>
                                  <td style={{ padding: "0.7rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    {pay && (
                                      <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, background: pay.status === "Paid" ? "rgba(0,245,160,0.1)" : pay.status === "Pending" ? "rgba(255,215,0,0.1)" : "rgba(255,0,127,0.1)", color: pay.status === "Paid" ? "#00F5A0" : pay.status === "Pending" ? "#FFD700" : "#FF007F" }}>
                                        {pay.status}
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ padding: "0.7rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "#52525B", fontSize: "0.72rem" }}>{new Date(row.created_at).toLocaleDateString("en-IN")}</td>
                                  <td style={{ padding: "0.7rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, background: row.status === "New" ? "rgba(229,152,155,0.1)" : row.status === "Reviewed" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", color: row.status === "New" ? "#E5989B" : row.status === "Reviewed" ? "#F59E0B" : "#10B981" }}>
                                      {row.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Detail Panel */}
                  {selected && <ClientDetailPanel
                    selected={selected}
                    payment={payments[selected.id]}
                    onClose={() => setSelected(null)}
                    onUpdateStatus={updateStatus}
                    onUpdatePayment={updatePayment}
                  />}
                </div>
              )}
            </div>
          )}

          {/* ══ PAYMENTS TAB ══════════════════════════════════════════════ */}
          {activeTab === "payments" && (
            <div>
              {/* Payment KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <KPICard icon="💵" label="Total Revenue" color="#00F5A0"
                  value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="from paid clients" trend="up" />
                <KPICard icon="✅" label="Paid" color="#00F2FE"
                  value={`${paidPayments.length}`} sub="successful payments" trend="up" />
                <KPICard icon="⏳" label="Pending" color="#FFD700"
                  value={`${pendingCount}`} sub="awaiting payment" trend="neutral" />
                <KPICard icon="↩️" label="Refunded" color="#FF007F"
                  value={`${allPayments.filter(p => p.status === "Refunded").length}`} sub="refund requests" trend="down" />
              </div>

              {/* Filter + Search */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center" }}>
                <div style={{ position: "relative", flex: "1 1 240px" }}>
                  <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#52525B" }}>🔍</span>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search client…"
                    style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.25rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", color: "#F5F7FA", fontSize: "0.83rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                {(["all", "Paid", "Pending", "Refunded"] as const).map(s => (
                  <button key={s} onClick={() => setPayFilter(s)}
                    style={{ padding: "0.5rem 1rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", border: `1px solid ${payFilter === s ? "rgba(0,242,254,0.4)" : "rgba(255,255,255,0.07)"}`, background: payFilter === s ? "rgba(0,242,254,0.08)" : "rgba(255,255,255,0.02)", color: payFilter === s ? "#00F2FE" : "#52525B", transition: "all 0.2s" }}>
                    {s === "all" ? "All" : s}
                  </button>
                ))}
              </div>

              {/* Payments Table */}
              <div style={{ background: "rgba(13,14,22,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "4rem", color: "#52525B" }}>Loading…</div>
                ) : filteredPayments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "4rem", color: "#52525B" }}>No payment records found.</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(0,0,0,0.4)" }}>
                          {["Client", "Plan", "Amount", "Pay Status", "Submission Date", "Actions"].map(h => (
                            <th key={h} style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525B", borderBottom: "1px solid rgba(255,255,255,0.05)", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map(row => {
                          const pay = payments[row.id];
                          if (!pay) return null;
                          return (
                            <tr key={row.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.15s" }}
                              onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.02)"}
                              onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                              <td style={{ padding: "0.8rem 1rem", verticalAlign: "middle" }}>
                                <div style={{ fontWeight: 700, color: "#F5F7FA", fontSize: "0.85rem" }}>{row.name || "—"}</div>
                                <div style={{ fontSize: "0.68rem", color: "#52525B" }}>{row.gender === "women" ? "🩷 Women" : "💪 Men"} · {row.age}y</div>
                              </td>
                              <td style={{ padding: "0.8rem 1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: PLAN_COLORS[pay.plan] }} />
                                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: PLAN_COLORS[pay.plan] }}>{pay.plan}</span>
                                </div>
                              </td>
                              <td style={{ padding: "0.8rem 1rem" }}>
                                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#F5F7FA" }}>₹{pay.amount.toLocaleString("en-IN")}</span>
                              </td>
                              <td style={{ padding: "0.8rem 1rem" }}>
                                <span style={{ padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: pay.status === "Paid" ? "rgba(0,245,160,0.1)" : pay.status === "Pending" ? "rgba(255,215,0,0.1)" : "rgba(255,0,127,0.1)", color: pay.status === "Paid" ? "#00F5A0" : pay.status === "Pending" ? "#FFD700" : "#FF007F" }}>
                                  {pay.status === "Paid" ? "✓ " : pay.status === "Pending" ? "⏳ " : "↩ "}{pay.status}
                                </span>
                              </td>
                              <td style={{ padding: "0.8rem 1rem", color: "#52525B", fontSize: "0.75rem" }}>{new Date(row.created_at).toLocaleDateString("en-IN")}</td>
                              <td style={{ padding: "0.8rem 1rem" }}>
                                <div style={{ display: "flex", gap: "0.375rem" }}>
                                  {(["Paid", "Pending", "Refunded"] as PaymentStatus[]).filter(s => s !== pay.status).map(s => (
                                    <button key={s} onClick={() => updatePayment(row.id, { status: s })}
                                      style={{ padding: "0.3rem 0.65rem", borderRadius: "8px", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#8B909E", transition: "all 0.2s" }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#F5F7FA"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#8B909E"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                                      → {s}
                                    </button>
                                  ))}
                                  {/* Plan switcher */}
                                  <select value={pay.plan} onChange={e => updatePayment(row.id, { plan: e.target.value as PlanTier, amount: PLAN_PRICES[e.target.value as PlanTier] })}
                                    style={{ padding: "0.3rem 0.5rem", borderRadius: "8px", fontSize: "0.68rem", fontWeight: 600, cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#8B909E", outline: "none" }}>
                                    {PLANS.map(p => <option key={p} value={p} style={{ background: "#0D0E16" }}>{p}</option>)}
                                  </select>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ SPONSORSHIP TAB ═══════════════════════════════════════════ */}
          {activeTab === "sponsorship" && (
            <SponsorshipTab rows={rows} paidPayments={paidPayments} isMobile={isMobile} />
          )}

        </div>
      </main>
    </div>
  );
}

/* ─── Sponsorship Media Kit Tab ────────────────────────────────────────── */
interface SponsorshipTabProps {
  rows: Submission[];
  paidPayments: PaymentRecord[];
  isMobile: boolean;
}

type BrandId = "muscleblaze" | "optimum" | "myprotein";

const BRAND_DETAILS: Record<BrandId, {
  name: string;
  color: string;
  tagline: string;
  preWorkout: string;
  wheyProtein: string;
  logo: string;
}> = {
  muscleblaze: {
    name: "MuscleBlaze",
    color: "#FF3E3E",
    tagline: "India's first clinically tested Biozyme Whey with 50% higher protein absorption.",
    preWorkout: "MB Pre-Workout Wrathx",
    wheyProtein: "MB Biozyme Whey Active",
    logo: "🔥 MB",
  },
  optimum: {
    name: "Optimum Nutrition",
    color: "#FFB000",
    tagline: "The world's #1 selling whey protein, delivering elite post-workout recovery.",
    preWorkout: "ON Gold Standard Pre-Workout",
    wheyProtein: "ON Gold Standard 100% Whey",
    logo: "🏅 ON",
  },
  myprotein: {
    name: "MyProtein",
    color: "#00D2C4",
    tagline: "Premium European formulation with 90% pure isolate protein content.",
    preWorkout: "MyProtein Alpha Pre-Workout",
    wheyProtein: "MyProtein Impact Whey Isolate",
    logo: "🔷 MYP",
  },
};

function SponsorshipTab({ rows, paidPayments, isMobile }: SponsorshipTabProps) {
  const [selectedBrand, setSelectedBrand] = useState<BrandId>("muscleblaze");
  const [copied, setCopied] = useState(false);
  const [clicks, setClicks] = useState(148);

  const brand = BRAND_DETAILS[selectedBrand];
  const shareUrl = `https://sandylifts.com/pitch/${selectedBrand}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Brand Selection & Share Link Card */}
      <div style={{
        background: "rgba(13,14,22,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "stretch" : "center",
        flexWrap: "wrap",
        gap: "1.5rem"
      }}>
        <div style={{ flex: "1 1 320px" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: brand.color, transition: "color 0.3s ease" }}>Active Sponsor Pitch</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#F5F7FA", margin: "0.25rem 0 0.5rem" }}>Brand Sponsorship Simulator</h3>
          <p style={{ fontSize: "0.8rem", color: "#8B909E", margin: 0 }}>Select a brand to view dynamic integration previews and generate customized live-sharing conversion pitch decks.</p>
        </div>
        
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
          {/* Brand select options */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", padding: "0.25rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", width: isMobile ? "100%" : "auto", flexWrap: "wrap" }}>
            {(Object.keys(BRAND_DETAILS) as BrandId[]).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedBrand(id)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  flex: isMobile ? "1 1 auto" : "none",
                  background: selectedBrand === id ? "rgba(255,255,255,0.08)" : "transparent",
                  color: selectedBrand === id ? BRAND_DETAILS[id].color : "#52525B",
                  transition: "all 0.25s ease"
                }}
              >
                {BRAND_DETAILS[id].logo} {BRAND_DETAILS[id].name}
              </button>
            ))}
          </div>

          {/* Copy live link button */}
          <button
            onClick={handleCopyLink}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "10px",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              width: isMobile ? "100%" : "auto",
              border: `1px solid ${brand.color}50`,
              background: `${brand.color}15`,
              color: brand.color,
              transition: "all 0.2s ease"
            }}
          >
            {copied ? "✓ Copied Link!" : "🔗 Share Media Kit Link"}
          </button>
        </div>
      </div>

      {/* KPI Stats Section for Brands */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <KPICard
          icon="👥"
          label="Total Pitch Reach"
          color={brand.color}
          value="182.5k"
          sub="Monthly Platform Interactions"
          trend="up"
          sparkData={[140, 155, 148, 162, 170, 178, 182]}
        />
        <KPICard
          icon="⚡"
          label="Contextual Ad CTR"
          color="#00F5A0"
          value="11.8%"
          sub="Buy Link Intent Clicks"
          trend="up"
          sparkData={[8.2, 9.4, 9.1, 10.5, 11.0, 11.4, 11.8]}
        />
        <KPICard
          icon="📦"
          label="Supplement Conversions"
          color="#00F2FE"
          value={`${clicks} clicks`}
          sub="Simulated Direct Directives"
          trend="up"
        />
        <KPICard
          icon="🎯"
          label="Target Fit Ratio"
          color="#7F00FF"
          value="94.2%"
          sub="Active Muscle-Gain Audience"
          trend="up"
        />
      </div>

      {/* Brand Simulator Presentation and Intent Grid */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1.5rem" }}>
        
        {/* Mobile View Simulator */}
        <div style={{
          background: "rgba(13,14,22,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525B" }}>Integration Preview</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F7FA", marginTop: "0.15rem" }}>AI Coach sponsored recommendation</div>
          </div>

          {/* Interactive Mobile Screen */}
          <div style={{
            alignSelf: "center",
            width: "320px",
            height: "440px",
            border: "8px solid #222235",
            borderRadius: "32px",
            background: "#07080E",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(0,242,254,0.05)"
          }}>
            {/* Camera notch */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "110px",
              height: "18px",
              background: "#222235",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
              zIndex: 30
            }} />

            {/* App Nav inside simulator */}
            <div style={{
              background: "rgba(13,14,22,0.9)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              padding: "1.2rem 1rem 0.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#F5F7FA", letterSpacing: "0.05em" }}>⚡ SANDY.LIFTS AI</span>
              <span style={{ fontSize: "0.6rem", color: brand.color, fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "4px", background: `${brand.color}15`, border: `1px solid ${brand.color}25` }}>ACTIVE</span>
            </div>

            {/* Chat Body Simulator */}
            <div style={{
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              height: "360px",
              overflowY: "auto"
            }}>
              {/* User message */}
              <div style={{
                background: "rgba(0,242,254,0.06)",
                border: "1px solid rgba(0,242,254,0.12)",
                borderRadius: "14px 14px 2px 14px",
                padding: "0.6rem 0.8rem",
                color: "#D8DBFC",
                fontSize: "0.75rem",
                alignSelf: "flex-end",
                maxWidth: "85%"
              }}>
                Bhai pre-workout aur protein me sabse best recommendation kya hai? High-intensity training krta hu.
              </div>

              {/* AI Coach sponsored response */}
              <div style={{
                background: "rgba(34,34,53,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px 14px 14px 2px",
                padding: "0.6rem 0.8rem",
                color: "#D8DBFC",
                fontSize: "0.75rem",
                alignSelf: "flex-start",
                maxWidth: "85%",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}>
                <div>
                  Bhai high-intensity training ke liye absolute best is **{brand.preWorkout}** for focus and blood pumps!
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "0.4rem" }}>
                  Post-workout recovery ke liye go with **{brand.wheyProtein}**. {brand.tagline}
                </div>

                {/* Sponsored Product Placement Widget */}
                <div style={{
                  marginTop: "0.4rem",
                  background: "rgba(7,8,14,0.9)",
                  border: `1px solid ${brand.color}35`,
                  borderRadius: "10px",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem"
                }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.6rem", color: "#52525B" }}>SPONSORED BRAND</span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#F5F7FA" }}>{brand.name} Pack</span>
                  </div>
                  <button
                    onClick={() => setClicks(c => c + 1)}
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      background: brand.color,
                      border: "none",
                      color: "#07080E",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: `0 0 10px ${brand.color}50`,
                      transition: "transform 0.1s"
                    }}
                  >
                    Buy Direct ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Pitch Analysis & Demographics */}
        <div style={{
          background: "rgba(13,14,22,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: brand.color, transition: "color 0.3s ease" }}>Conversion Analysis</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#F5F7FA", marginTop: "0.15rem" }}>Why Brands Get 10x ROI on Sandy.Lifts</div>
          </div>

          <p style={{ fontSize: "0.8rem", color: "#8B909E", margin: 0, lineHeight: 1.6 }}>
            Unlike cold social media banners, Sandy.Lifts utilizes **Contextual AI Recommendations** inside real workout calculations. The system analyzes user assessments dynamically (e.g., body weight, daily caloric targets, and training style) and introduces your products naturally within their daily guidance protocols.
          </p>

          {/* Demographic Intent Share Graph */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525B" }}>Client Goal Intent Breakdown</div>

            {[
              { label: "Muscle Gaining (High Whey & Pre-Workout Demand)", value: 55, color: "#00F2FE" },
              { label: "Fat Loss & Conditioning (High L-Carnitine Demand)", value: 25, color: "#7F00FF" },
              { label: "General Endurance (High Electrolytes & Vitamin Demand)", value: 20, color: "#00F5A0" }
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.72rem" }}>
                  <span style={{ color: "#8B909E", fontWeight: 600 }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 700 }}>{item.value}%</span>
                </div>
                <div style={{ height: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${item.value}%`,
                    background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                    borderRadius: "4px",
                    boxShadow: `0 0 6px ${item.color}40`
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* ROI Metric Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.03)",
            padding: "1rem"
          }}>
            <div>
              <div style={{ fontSize: "0.6rem", color: "#52525B", fontWeight: 600, textTransform: "uppercase" }}>Industry Avg CTR</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FF007F" }}>1.2%</div>
              <span style={{ fontSize: "0.65rem", color: "#52525B" }}>Standard Instagram story link</span>
            </div>
            <div>
              <div style={{ fontSize: "0.6rem", color: "#52525B", fontWeight: 600, textTransform: "uppercase" }}>Sandy.Lifts CTR</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#00F5A0" }}>11.8%</div>
              <span style={{ fontSize: "0.65rem", color: brand.color }}>10x Higher Brand Direct Link intent</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Client Detail Panel ────────────────────────────────────────────────── */
function ClientDetailPanel({ selected, payment, onClose, onUpdateStatus, onUpdatePayment }: {
  selected: Submission;
  payment?: PaymentRecord;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdatePayment: (id: string, updates: Partial<PaymentRecord>) => void;
}) {
  const lifestyle = parseJSON(selected.lifestyle);
  const diet = parseJSON(selected.diet);
  const fitness = parseJSON(selected.fitness);
  const goals = parseJSON(selected.goals);

  const isWomen = selected.gender === "women";
  const accentColor = isWomen ? "#FF6B9D" : "#4DA3FF";
  const sectionBg = isWomen ? "rgba(255,107,157,0.05)" : "rgba(0,242,254,0.04)";
  const sectionBorder = isWomen ? "rgba(255,107,157,0.15)" : "rgba(0,242,254,0.12)";

  const Section = ({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: "0.875rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.7rem", borderRadius: "8px", background: sectionBg, border: `1px solid ${sectionBorder}`, marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.8rem" }}>{emoji}</span>
        <span style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: accentColor }}>{title}</span>
      </div>
      <div style={{ padding: "0 0.4rem" }}>{children}</div>
    </div>
  );

  const Row = ({ icon, label, value }: { icon: string; label: string; value: any }) => {
    const valStr = Array.isArray(value) ? value.join(", ") : value;
    if (!valStr || valStr === "None" || valStr === "[]") return null;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: "0.78rem" }}>
        <span style={{ color: "#52525B", display: "flex", gap: "0.35rem", alignItems: "center", flexShrink: 0, fontSize: "0.75rem" }}>
          <span>{icon}</span>{label}
        </span>
        <span style={{ color: "#F5F7FA", fontWeight: 600, textAlign: "right", maxWidth: "58%", lineHeight: 1.3 }}>{valStr}</span>
      </div>
    );
  };

  const STATUS_INFO: Record<string, { bg: string; color: string }> = {
    "New": { bg: "rgba(229,152,155,0.1)", color: "#E5989B" },
    "Reviewed": { bg: "rgba(245,158,11,0.1)", color: "#F59E0B" },
    "Plan Sent": { bg: "rgba(16,185,129,0.1)", color: "#10B981" },
  };

  return (
    <div style={{ background: "rgba(13,14,22,0.9)", border: `1px solid ${accentColor}20`, borderRadius: "16px", padding: "1.25rem", position: "sticky", top: "80px", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontWeight: 800, color: "#F5F7FA", fontSize: "1.05rem" }}>{selected.name}</div>
          <div style={{ fontSize: "0.72rem", color: "#52525B", marginTop: "0.2rem" }}>{selected.age}y · {selected.height} · {selected.weight}kg</div>
          <span style={{ display: "inline-block", marginTop: "0.35rem", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, background: isWomen ? "rgba(255,107,157,0.1)" : "rgba(77,163,255,0.1)", color: accentColor }}>
            {isWomen ? "🩷 Women" : "💪 Men"}
          </span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#52525B", cursor: "pointer", fontSize: "1.25rem", padding: "0.25rem", lineHeight: 1 }}>×</button>
      </div>

      {/* Payment Badge */}
      {payment && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "0.7rem 0.875rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.65rem", color: "#52525B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Current Plan</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: PLAN_COLORS[payment.plan] }}>{payment.plan}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1rem", fontWeight: 900, color: "#F5F7FA" }}>₹{payment.amount.toLocaleString("en-IN")}</div>
            <span style={{ padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700, background: payment.status === "Paid" ? "rgba(0,245,160,0.1)" : payment.status === "Pending" ? "rgba(255,215,0,0.1)" : "rgba(255,0,127,0.1)", color: payment.status === "Paid" ? "#00F5A0" : payment.status === "Pending" ? "#FFD700" : "#FF007F" }}>
              {payment.status}
            </span>
          </div>
        </div>
      )}

      {/* Status Controls */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
        {["New", "Reviewed", "Plan Sent"].map(s => (
          <button key={s} onClick={() => onUpdateStatus(selected.id, s)}
            style={{ padding: "0.35rem 0.75rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${selected.status === s ? (STATUS_INFO[s]?.color || "#fff") : "rgba(255,255,255,0.08)"}`, background: selected.status === s ? (STATUS_INFO[s]?.bg || "rgba(255,255,255,0.08)") : "rgba(255,255,255,0.02)", color: selected.status === s ? (STATUS_INFO[s]?.color || "#fff") : "#52525B" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Payment controls */}
      {payment && (
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
          {(["Paid", "Pending", "Refunded"] as PaymentStatus[]).map(s => (
            <button key={s} onClick={() => onUpdatePayment(selected.id, { status: s })}
              style={{ padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${payment.status === s ? "rgba(0,242,254,0.3)" : "rgba(255,255,255,0.06)"}`, background: payment.status === s ? "rgba(0,242,254,0.06)" : "rgba(255,255,255,0.02)", color: payment.status === s ? "#00F2FE" : "#52525B" }}>
              {s === "Paid" ? "✓ Paid" : s === "Pending" ? "⏳ Pending" : "↩ Refund"}
            </button>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <a href={`https://wa.me/918968244407?text=${encodeURIComponent(`Hi ${selected.name || ""}! Sandy from Sandy.Lifts here. Your personalised plan is ready 🎉\n\nThank you so much! 🙏✨`)}`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.65rem", borderRadius: "10px", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
          💬 WhatsApp
        </a>
        <button type="button" onClick={() => downloadPDF(selected)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.65rem", borderRadius: "10px", background: "rgba(0,242,254,0.06)", border: "1px solid rgba(0,242,254,0.2)", color: "#00F2FE", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}>
          📥 PDF Report
        </button>
      </div>

      {/* Data Sections */}
      {isWomen ? (
        <>
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
            <Row icon="📅" label="Last Cycle" value={lifestyle.lastCycleDate} />
            <Row icon="🤰" label="Pregnancy" value={lifestyle.pregnancyHistory} />
            <Row icon="🧪" label="Medicines" value={lifestyle.medicines} />
            <Row icon="😴" label="Sleep" value={lifestyle.sleep} />
            {lifestyle.stress !== undefined && <Row icon="📈" label="Stress" value={`${lifestyle.stress}/10`} />}
            <Row icon="💧" label="Water" value={lifestyle.water} />
          </Section>
          <Section emoji="🌙" title="Lifestyle & Diet">
            <Row icon="💼" label="Job" value={lifestyle.job} />
            <Row icon="🥗" label="Food Pref." value={diet.food} />
            <Row icon="🍽️" label="Meals/Day" value={diet.meals} />
            <Row icon="🍟" label="Junk Habit" value={diet.junk} />
            <Row icon="🌙" label="Late Night" value={diet.lateNight} />
            <Row icon="🚫" label="Dislikes" value={diet.dislikes} />
          </Section>
          <Section emoji="💪" title="Fitness & Training">
            <Row icon="🏅" label="Experience" value={fitness.experience} />
            <Row icon="🏃‍♀️" label="Activity" value={fitness.activity} />
            <Row icon="⏱️" label="Time Avail." value={fitness.time} />
            <Row icon="📍" label="Place" value={fitness.place} />
          </Section>
          <Section emoji="🎯" title="Goals">
            <Row icon="🔥" label="Main Goal" value={goals.main} />
            <Row icon="📌" label="Focus Area" value={goals.focus} />
            <Row icon="📅" label="1-Mo Target" value={goals.target} />
            <Row icon="💬" label="Motivation" value={goals.why} />
          </Section>
        </>
      ) : (
        <>
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
            <Row icon="🚬" label="Smoking/Alcohol" value={lifestyle.smokingAlcohol} />
            <Row icon="🧪" label="Medicines" value={lifestyle.medicines} />
          </Section>
          <Section emoji="🏋️" title="Training History">
            <Row icon="🏅" label="Trained Before" value={fitness.experience} />
            <Row icon="🚫" label="Why Stopped" value={fitness.whyStopped} />
            <Row icon="⚡" label="Activity Level" value={fitness.activity} />
            <Row icon="🏃" label="Prev. Activity" value={fitness.previousActivity} />
          </Section>
          <Section emoji="💼" title="Lifestyle & Diet">
            <Row icon="🖥️" label="Job Type" value={lifestyle.job} />
            <Row icon="⏰" label="Work Hours" value={lifestyle.workHours} />
            <Row icon="🍱" label="Outside Food" value={lifestyle.outsideFood} />
            <Row icon="🥗" label="Food Pref." value={diet.food} />
            <Row icon="🍽️" label="Meals/Day" value={diet.meals} />
            <Row icon="🍟" label="Junk Habit" value={diet.junk} />
            <Row icon="💊" label="Supplements" value={diet.supplements} />
            <Row icon="🚫" label="Dislikes" value={diet.dislikes} />
          </Section>
          <Section emoji="🎯" title="Goals">
            <Row icon="🔥" label="Primary Goal" value={goals.main} />
            <Row icon="📌" label="Secondary" value={goals.focus} />
            <Row icon="📅" label="1-Mo Target" value={goals.target} />
            <Row icon="🏆" label="Sport Target" value={goals.sportTarget} />
            <Row icon="💬" label="Motivation" value={goals.why} />
          </Section>
        </>
      )}

      {selected.comments && (
        <Section emoji="📝" title="Additional Comments">
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#D8DBFC", fontStyle: "italic", lineHeight: 1.45 }}>&ldquo;{selected.comments}&rdquo;</p>
        </Section>
      )}

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.65rem", fontSize: "0.65rem", color: "#52525B", display: "flex", justifyContent: "space-between" }}>
        <span>ID: {selected.id.slice(0, 8)}…</span>
        <span>{new Date(selected.created_at).toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
