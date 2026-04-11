"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/* ─── Types ──────────────────────────────────────────────── */
type Mode = "diet" | "workout";
type Step = "select" | "form" | "chat";
interface Message { role: "user" | "ai"; content: string; macros?: MacroData | null; }
interface MacroData { protein: number; carbs: number; fat: number; calories: number; }
interface LeadFormData { name: string; whatsapp: string; goal: string; }

/* ─── Data ───────────────────────────────────────────────── */
const DIET_CHIPS = [
  { label: "🔥 Fat Loss", value: "Fat Loss" },
  { label: "💪 Muscle Gain", value: "Muscle Gain" },
  { label: "⚖️ Maintenance", value: "Maintenance" },
  { label: "🥗 No Bro-Science", value: "No Bro-Science" },
  { label: "🛡️ No Processed Food", value: "No Processed Food" },
  { label: "🌿 High Protein Veg", value: "High Protein Vegetarian" },
  { label: "⏰ Intermittent Fasting", value: "Intermittent Fasting" },
  { label: "💧 High Hydration Focus", value: "High Hydration" },
];

const WORKOUT_CHIPS = [
  { label: "🏠 Home Workout", value: "Home Workout" },
  { label: "🏋️ Hypertrophy", value: "Hypertrophy" },
  { label: "⚡ Fat Burn HIIT", value: "Fat Burn HIIT" },
  { label: "🔩 Strength Focus", value: "Strength" },
  { label: "🧘 Calisthenics", value: "Calisthenics" },
  { label: "🦵 Leg Day Emphasis", value: "Leg Day Emphasis" },
  { label: "🌅 Morning Routine", value: "Morning Routine" },
  { label: "♾️ Full Body", value: "Full Body" },
];

const MACRO_COLORS = ["#4DA3FF", "#A78BFA", "#22D3A5"];

/* ─── Helper: Parse MACROS_JSON from AI response ─────────── */
function parseMacros(text: string): MacroData | null {
  const match = text.match(/MACROS_JSON:\s*(\{[^}]+\})/);
  if (!match) return null;
  try { return JSON.parse(match[1]) as MacroData; } catch { return null; }
}

/* ─── Macro Ring Chart ────────────────────────────────────── */
function MacroRing({ macros }: { macros: MacroData }) {
  const data = [
    { name: "Protein", value: macros.protein, unit: "g" },
    { name: "Carbs",   value: macros.carbs,   unit: "g" },
    { name: "Fat",     value: macros.fat,     unit: "g" },
  ];
  return (
    <div style={{
      background: "rgba(11,14,22,0.9)",
      border: "1px solid rgba(77,163,255,0.2)",
      borderRadius: "20px",
      padding: "1.25rem",
      marginTop: "0.75rem",
    }}>
      <div style={{ fontSize: "0.72rem", color: "#66E6FF", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.75rem" }}>
        📊 MACRO BREAKDOWN — {macros.calories} KCAL
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{ width: 110, height: 110, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={3} strokeWidth={0}>
                {data.map((_, i) => <Cell key={i} fill={MACRO_COLORS[i]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#07090D", border: "1px solid rgba(77,163,255,0.3)", borderRadius: "10px", fontSize: "0.78rem", color: "#F5F7FA" }}
                formatter={(v: unknown, n: unknown) => [`${v}g`, `${n}`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          {data.map((d, i) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: MACRO_COLORS[i], flexShrink: 0, boxShadow: `0 0 6px ${MACRO_COLORS[i]}80` }} />
              <span style={{ fontSize: "0.8rem", color: "#AAB3C5", flex: 1 }}>{d.name}</span>
              <span style={{ fontSize: "0.85rem", color: "#F5F7FA", fontWeight: 700 }}>{d.value}g</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Quick Chip ─────────────────────────────────────────── */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.4rem 0.9rem",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: 600,
        border: active ? "1px solid rgba(77,163,255,0.7)" : "1px solid rgba(77,163,255,0.2)",
        background: active ? "rgba(77,163,255,0.18)" : "rgba(11,14,22,0.5)",
        color: active ? "#66E6FF" : "#AAB3C5",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

/* ─── AI Message Bubble ──────────────────────────────────── */
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const cleanText = msg.content.replace(/MACROS_JSON:\s*\{[^}]+\}/g, "").trim();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: "0.5rem" }}>
      {!isUser && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "0.25rem" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#4DA3FF,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem" }}>✨</div>
          <span style={{ fontSize: "0.7rem", color: "#66E6FF", fontWeight: 700, letterSpacing: "0.08em" }}>SANDY AI</span>
        </div>
      )}
      <div style={{
        padding: "0.875rem 1.1rem",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser
          ? "linear-gradient(135deg, rgba(77,163,255,0.25), rgba(167,139,250,0.2))"
          : "rgba(11,14,22,0.85)",
        border: isUser ? "1px solid rgba(77,163,255,0.35)" : "1px solid rgba(77,163,255,0.12)",
        color: "#F5F7FA",
        fontSize: "0.88rem",
        lineHeight: 1.75,
        whiteSpace: "pre-wrap",
        maxWidth: "88%",
        backdropFilter: "blur(10px)",
      }}>
        {cleanText}
      </div>
      {msg.macros && <MacroRing macros={msg.macros} />}
    </div>
  );
}

/* ─── Typing Indicator ───────────────────────────────────── */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.1rem", background: "rgba(11,14,22,0.85)", border: "1px solid rgba(77,163,255,0.12)", borderRadius: "18px 18px 18px 4px", width: "fit-content" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#4DA3FF", animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.7 }} />
      ))}
    </div>
  );
}

/* ─── Export Helper ──────────────────────────────────────── */
function exportPlan(messages: Message[], mode: Mode) {
  const text = messages
    .map(m => `[${m.role === "user" ? "YOU" : "SANDY AI"}]\n${m.content}\n`)
    .join("\n---\n\n");
  const blob = new Blob([`SANDY.LIFTS — AI ${mode === "diet" ? "Diet" : "Workout"} Plan\n${"=".repeat(50)}\n\n${text}`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `sandylifts-${mode}-plan.txt`; a.click();
  URL.revokeObjectURL(url);
}

/* ─── Lead Gen Card ─────────────────────────────────────── */
function LeadGenCard() {
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lead, setLead] = useState<LeadFormData>({ name: "", whatsapp: "", goal: "" });

  const lgInputSx: React.CSSProperties = {
    width: "100%", padding: "0.8rem 1rem",
    background: "rgba(10,10,20,0.85)",
    border: "1px solid rgba(167,139,250,0.2)",
    borderRadius: "12px", color: "#F5F7FA",
    fontSize: "0.9rem", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  };

  const handleSubmit = async () => {
    if (!lead.name.trim() || !lead.whatsapp.trim() || !lead.goal) return;
    setSubmitting(true);
    // Simulate network delay — swap with real endpoint when backend is ready
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="ac-in-4" style={{ marginTop: "1.25rem" }}>
      <div style={{
        background: "rgba(11,14,22,0.82)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(167,139,250,0.22)",
        borderRadius: "24px",
        overflow: "hidden",
        transition: "box-shadow 0.4s ease",
        boxShadow: expanded ? "0 0 60px rgba(167,139,250,0.12), 0 24px 80px rgba(0,0,0,0.45)" : "0 8px 40px rgba(0,0,0,0.35)",
      }}>

        {/* ── Top banner ── always visible ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem",
          padding: "1.5rem 2rem",
          background: "linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(77,163,255,0.04) 100%)",
          borderBottom: expanded ? "1px solid rgba(167,139,250,0.14)" : "none",
        }}>

          {/* Left: Icon + copy */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "1 1 280px" }}>
            <div style={{
              width: 52, height: 52, flexShrink: 0, borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(77,163,255,0.12))",
              border: "1px solid rgba(167,139,250,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: "0 0 20px rgba(167,139,250,0.15)",
              animation: "lgPulse 3s ease-in-out infinite",
            }}>
              🎧
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "#A78BFA", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.2rem" }}>
                HUMAN EXPERT GUIDANCE
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#F5F7FA", margin: "0 0 0.2rem", lineHeight: 1.2 }}>
                Connect with the{" "}
                <span style={{ background: "linear-gradient(135deg,#A78BFA,#66E6FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  LIFTWITHSANDY Team
                </span>
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#6B6F9A", margin: 0, lineHeight: 1.5 }}>
                Drop your details and our transformation experts will reach out to map your journey.
              </p>
            </div>
          </div>

          {/* Right: CTA / collapse toggle */}
          {!submitted && (
            <button
              className="lg-expand"
              onClick={() => setExpanded(p => !p)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.7rem 1.4rem", borderRadius: "12px",
                background: expanded ? "rgba(167,139,250,0.14)" : "rgba(167,139,250,0.08)",
                border: "1px solid rgba(167,139,250,0.28)",
                color: "#C4B5FD", fontWeight: 700, fontSize: "0.88rem",
                cursor: "pointer", transition: "all 0.25s ease", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {expanded ? "✕ Close" : "🤝 Get Personalised Help"}
            </button>
          )}

          {submitted && (
            <div className="lg-success-icon" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", borderRadius: "12px", background: "rgba(34,211,165,0.1)", border: "1px solid rgba(34,211,165,0.3)", color: "#22D3A5", fontWeight: 700, fontSize: "0.88rem", flexShrink: 0 }}>
              ✅ Message Received!
            </div>
          )}
        </div>

        {/* ── Expandable inline form ── */}
        {expanded && !submitted && (
          <div className="lg-form-wrap" style={{ padding: "1.75rem 2rem" }}>

            {/* Subtitle */}
            <p style={{ fontSize: "0.83rem", color: "#AAB3C5", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Fill in the form below — one of our coaches will reach out within <strong style={{ color: "#C4B5FD" }}>24 hours</strong> via WhatsApp to discuss your goals and create a personalised roadmap.
            </p>

            {/* Form grid */}
            <div className="lg-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.875rem", marginBottom: "1.25rem" }}>

              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#8B8BAD", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  YOUR NAME *
                </label>
                <input
                  className="lg-input"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={lead.name}
                  onChange={e => setLead(p => ({ ...p, name: e.target.value }))}
                  style={lgInputSx}
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#8B8BAD", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  WHATSAPP NUMBER *
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", color: "#6B6F9A", pointerEvents: "none" }}>📱</span>
                  <input
                    className="lg-input"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={lead.whatsapp}
                    onChange={e => setLead(p => ({ ...p, whatsapp: e.target.value }))}
                    style={{ ...lgInputSx, paddingLeft: "2.5rem" }}
                  />
                </div>
              </div>

              {/* Goal */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#8B8BAD", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  PRIMARY GOAL *
                </label>
                <select
                  className="lg-input"
                  value={lead.goal}
                  onChange={e => setLead(p => ({ ...p, goal: e.target.value }))}
                  style={{ ...lgInputSx, appearance: "none", cursor: "pointer" }}
                >
                  <option value="">Select your goal</option>
                  <option value="Fat Loss">🔥 Fat Loss</option>
                  <option value="Muscle Gain">💪 Muscle Gain</option>
                  <option value="Body Recomposition">⚖️ Body Recomposition</option>
                  <option value="Strength Building">🏋️ Strength Building</option>
                  <option value="General Fitness">❤️ General Fitness</option>
                  <option value="Nutrition Overhaul">🥗 Nutrition Overhaul</option>
                </select>
              </div>
            </div>

            {/* Trust row + Submit */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                {["🔒 Private & secure", "⚡ 24-hr response", "🆓 No commitment"].map(t => (
                  <span key={t} style={{ fontSize: "0.75rem", color: "#6B6F9A", display: "flex", alignItems: "center", gap: "0.3rem" }}>{t}</span>
                ))}
              </div>

              <button
                className="lg-submit"
                onClick={handleSubmit}
                disabled={submitting || !lead.name.trim() || !lead.whatsapp.trim() || !lead.goal}
                style={{
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  padding: "0.875rem 2rem", borderRadius: "14px",
                  background: "linear-gradient(135deg, #A78BFA, #7C3AED)",
                  border: "1px solid rgba(167,139,250,0.5)",
                  color: "#fff", fontWeight: 800, fontSize: "0.95rem",
                  cursor: "pointer", transition: "all 0.25s ease",
                  boxShadow: "0 0 24px rgba(167,139,250,0.3), 0 4px 16px rgba(0,0,0,0.4)",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                {submitting ? (
                  <>
                    <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "dotPulse 0.8s linear infinite", display: "inline-block" }} />
                    Sending…
                  </>
                ) : (
                  <>🚀 Connect with Team</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Success state ── */}
        {submitted && (
          <div className="lg-form-wrap" style={{ padding: "1.75rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem", animation: "lgSuccess 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>🎉</div>
            <h4 style={{ color: "#F5F7FA", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
              You&apos;re on the list, {lead.name.split(" ")[0]}!
            </h4>
            <p style={{ color: "#AAB3C5", fontSize: "0.88rem", lineHeight: 1.65, maxWidth: 440, margin: "0 auto 1.25rem" }}>
              One of our LIFTWITHSANDY coaches will WhatsApp you within <strong style={{ color: "#22D3A5" }}>24 hours</strong> to discuss your{" "}
              <strong style={{ color: "#C4B5FD" }}>{lead.goal}</strong> journey. Keep an eye on your messages! 💪
            </p>
            <button
              onClick={() => { setSubmitted(false); setExpanded(false); setLead({ name: "", whatsapp: "", goal: "" }); }}
              style={{ padding: "0.6rem 1.25rem", borderRadius: "10px", background: "transparent", border: "1px solid rgba(167,139,250,0.25)", color: "#8B8BAD", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s" }}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function AICoachPage() {
  const [mode, setMode] = useState<Mode>("diet");
  const [step, setStep] = useState<Step>("select");
  const [chips, setChips] = useState<string[]>([]);
  const [form, setForm] = useState({ goal: "", diet: "", allergies: "", activity: "", experience: "", days: "", equipment: "", injuries: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const toggleChip = (val: string) =>
    setChips(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]);

  const fetchAI = useCallback(async (userText: string, history: Message[]): Promise<{ reply: string; macros: MacroData | null }> => {
    const endpoint = mode === "diet" ? "/api/ai/diet" : "/api/ai/workout";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
      });
      const data = await res.json();
      const reply = data.reply || "I'm having trouble responding right now. Please try again.";
      return { reply, macros: parseMacros(reply) };
    } catch {
      return { reply: "Connection error. Please try again.", macros: null };
    }
  }, [mode]);

  const handleStart = async () => {
    const isDiet = mode === "diet";
    const hasRequired = isDiet ? (form.goal && form.diet && acceptedTerms) : (form.goal && form.experience && acceptedTerms);
    if (!hasRequired) {
      alert("Please fill in all required fields and accept the disclaimer.");
      return;
    }

    const chipStr = chips.length ? ` Preferences: ${chips.join(", ")}.` : "";
    let userMsg = "";

    if (isDiet) {
      userMsg = `My goal is ${form.goal}. Diet type: ${form.diet}.${form.allergies ? ` Allergies: ${form.allergies}.` : ""} Activity level: ${form.activity || "Moderately active"}.${chipStr} Please generate my personalised meal plan.`;
    } else {
      userMsg = `Goal: ${form.goal}. Experience: ${form.experience}. Training ${form.days || "4"} days/week. Equipment: ${form.equipment || "Full gym"}.${form.injuries ? ` Injuries: ${form.injuries}.` : ""}${chipStr} Please generate my full weekly workout plan.`;
    }

    setStep("chat");
    const initialMsgs: Message[] = [{ role: "user", content: userMsg }];
    setMessages(initialMsgs);
    setLoading(true);
    const { reply, macros } = await fetchAI(userMsg, initialMsgs);
    setMessages([...initialMsgs, { role: "ai", content: reply, macros }]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs);
    setLoading(true);
    const { reply, macros } = await fetchAI(userMsg, newMsgs);
    setMessages([...newMsgs, { role: "ai", content: reply, macros }]);
    setLoading(false);
  };

  const reset = () => { setStep("select"); setMessages([]); setChips([]); setAcceptedTerms(false); setForm({ goal: "", diet: "", allergies: "", activity: "", experience: "", days: "", equipment: "", injuries: "" }); };

  /* CSS-in-JS keyframes injected once */
  const styles = `
    @keyframes dotPulse { 0%,80%,100%{transform:scale(0.8);opacity:0.4} 40%{transform:scale(1.2);opacity:1} }
    @keyframes acFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes acShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes acPulse { 0%,100%{box-shadow:0 0 20px rgba(77,163,255,0.2)} 50%{box-shadow:0 0 40px rgba(77,163,255,0.5)} }
    @keyframes acGlow { 0%,100%{opacity:0.5} 50%{opacity:1} }
    @keyframes lgPulse { 0%,100%{box-shadow:0 0 20px rgba(167,139,250,0.25),0 0 60px rgba(167,139,250,0.08)} 50%{box-shadow:0 0 35px rgba(167,139,250,0.45),0 0 80px rgba(167,139,250,0.15)} }
    @keyframes lgSlideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes lgSuccess { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
    .ac-in { animation: acFadeUp 0.5s ease both; }
    .ac-in-2 { animation: acFadeUp 0.5s 0.1s ease both; }
    .ac-in-3 { animation: acFadeUp 0.5s 0.2s ease both; }
    .ac-in-4 { animation: acFadeUp 0.5s 0.35s ease both; }
    .ac-mode-btn:hover { transform: translateY(-2px); }
    .ac-chip:hover { border-color: rgba(77,163,255,0.6) !important; color: #66E6FF !important; }
    .ac-send:hover:not(:disabled) { box-shadow: 0 0 20px rgba(77,163,255,0.4); transform: scale(1.04); }
    .ac-send:disabled { opacity: 0.5; cursor: not-allowed; }
    .ac-export:hover { background: rgba(34,197,94,0.2) !important; border-color: rgba(34,197,94,0.5) !important; }
    .lg-input:focus { border-color: rgba(167,139,250,0.55) !important; box-shadow: 0 0 0 3px rgba(167,139,250,0.1) !important; }
    .lg-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 40px rgba(167,139,250,0.45), 0 8px 24px rgba(0,0,0,0.4) !important; }
    .lg-submit:disabled { opacity: 0.55; cursor: not-allowed; }
    .lg-expand:hover { border-color: rgba(167,139,250,0.4) !important; background: rgba(167,139,250,0.1) !important; }
    .lg-form-wrap { animation: lgSlideDown 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
    .lg-success-icon { animation: lgSuccess 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
    @media (max-width: 768px) {
      .ac-layout { flex-direction: column !important; }
      .ac-sidebar { width: 100% !important; min-width: unset !important; border-right: none !important; border-bottom: 1px solid rgba(77,163,255,0.12) !important; }
      .ac-main { height: 420px !important; }
      .lg-grid { grid-template-columns: 1fr !important; }
    }
  `;

  return (
    <div style={{ minHeight: "100vh", paddingTop: "80px", background: "linear-gradient(180deg, #07090D 0%, #05050B 100%)", color: "#F5F7FA", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{styles}</style>

      {/* Ambient background */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(77,163,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(167,139,250,0.06) 0%, transparent 60%)" }} />

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "2.5rem 1.5rem 4rem", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="ac-in" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 1rem", borderRadius: "999px", background: "rgba(77,163,255,0.08)", border: "1px solid rgba(77,163,255,0.25)", marginBottom: "1rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4DA3FF", boxShadow: "0 0 8px #4DA3FF", display: "inline-block", animation: "acGlow 2s ease-in-out infinite" }} />
            <span style={{ color: "#4DA3FF", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>SANDY.LIFTS AI COMMAND CENTER</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.75rem", color: "#F5F7FA" }}>
            Your Dual-Core{" "}
            <span style={{ background: "linear-gradient(135deg,#4DA3FF,#66E6FF,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              AI Coach
            </span>
          </h1>
          <p style={{ color: "#AAB3C5", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7, fontSize: "0.95rem" }}>
            Science-backed plans. Zero bro-science. Personalised just for you.
          </p>
        </div>

        {/* ── Mode Selector (always visible) ── */}
        <div className="ac-in-2" style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
          {([["diet", "🥗", "Diet Coach", "Real-food meal plans"], ["workout", "💪", "Workout Coach", "Periodised weekly programs"]] as const).map(([m, icon, title, sub]) => (
            <button
              key={m}
              className="ac-mode-btn"
              onClick={() => { setMode(m); setStep("select"); setMessages([]); setChips([]); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.875rem 1.5rem", borderRadius: "16px",
                background: mode === m ? "rgba(77,163,255,0.14)" : "rgba(11,14,22,0.7)",
                border: mode === m ? "1px solid rgba(77,163,255,0.55)" : "1px solid rgba(77,163,255,0.12)",
                color: mode === m ? "#66E6FF" : "#AAB3C5",
                cursor: "pointer", transition: "all 0.25s ease",
                backdropFilter: "blur(12px)",
                boxShadow: mode === m ? "0 0 24px rgba(77,163,255,0.15)" : "none",
              }}
            >
              <span style={{ fontSize: "1.4rem" }}>{icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{title}</div>
                <div style={{ fontSize: "0.72rem", opacity: 0.65, fontWeight: 400 }}>{sub}</div>
              </div>
              {mode === m && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4DA3FF", boxShadow: "0 0 8px #4DA3FF", marginLeft: "auto" }} />}
            </button>
          ))}
        </div>

        {/* ── Glassmorphism Command Panel ── */}
        <div className="ac-in-3" style={{
          background: "rgba(11,14,22,0.75)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(77,163,255,0.15)",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(77,163,255,0.05)",
        }}>

          {/* ── SELECT step ── */}
          {step === "select" && (
            <div style={{ padding: "2.5rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.72rem", color: "#66E6FF", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.75rem" }}>
                  ⚡ QUICK SELECT — {mode === "diet" ? "NUTRITION" : "TRAINING"} PREFERENCES
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {(mode === "diet" ? DIET_CHIPS : WORKOUT_CHIPS).map(c => (
                    <Chip key={c.value} label={c.label} active={chips.includes(c.value)} onClick={() => toggleChip(c.value)} />
                  ))}
                </div>
              </div>

              {chips.length > 0 && (
                <div style={{ marginBottom: "1.25rem", padding: "0.625rem 1rem", borderRadius: "10px", background: "rgba(77,163,255,0.06)", border: "1px solid rgba(77,163,255,0.15)", fontSize: "0.8rem", color: "#66E6FF" }}>
                  ✓ Selected: {chips.join(" · ")}
                </div>
              )}

              <button
                onClick={() => setStep("form")}
                style={{
                  width: "100%", padding: "1rem", borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(77,163,255,0.2), rgba(167,139,250,0.2))",
                  border: "1px solid rgba(77,163,255,0.45)",
                  color: "#66E6FF", fontWeight: 700, fontSize: "1rem",
                  cursor: "pointer", transition: "all 0.25s ease",
                  animation: "acPulse 3s ease-in-out infinite",
                }}
              >
                Continue → Build My {mode === "diet" ? "Diet" : "Workout"} Plan
              </button>
            </div>
          )}

          {/* ── FORM step ── */}
          {step === "form" && (
            <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#66E6FF", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "-0.25rem" }}>
                {mode === "diet" ? "🥗 DIET PLAN BUILDER" : "💪 WORKOUT PLAN BUILDER"}
              </div>

              {mode === "diet" ? (
                <>
                  <FormRow label="Primary goal *">
                    <SelectField value={form.goal} onChange={v => setForm(p => ({ ...p, goal: v }))} options={[["", "Select your goal"], ["Fat Loss", "🔥 Fat Loss"], ["Muscle Gain", "💪 Muscle Gain"], ["Maintenance", "⚖️ Maintenance"]]} />
                  </FormRow>
                  <FormRow label="Diet type *">
                    <SelectField value={form.diet} onChange={v => setForm(p => ({ ...p, diet: v }))} options={[["", "Select diet type"], ["Non-vegetarian", "🍗 Non-vegetarian"], ["Vegetarian", "🥦 Vegetarian"], ["Vegan", "🌱 Vegan"], ["Pescatarian", "🐟 Pescatarian"]]} />
                  </FormRow>
                  <FormRow label="Allergies / intolerances">
                    <input className="ac-input" style={inputSx} type="text" placeholder="e.g. nuts, gluten, dairy (leave blank if none)" value={form.allergies} onChange={e => setForm(p => ({ ...p, allergies: e.target.value }))} />
                  </FormRow>
                  <FormRow label="Activity level">
                    <SelectField value={form.activity} onChange={v => setForm(p => ({ ...p, activity: v }))} options={[["", "Select activity level"], ["Sedentary", "😴 Sedentary — desk job"], ["Lightly Active", "🚶 Lightly active — 1–3×/week"], ["Moderately Active", "🏃 Moderately active — 3–5×/week"], ["Very Active", "⚡ Very active — 6×+/week"]]} />
                  </FormRow>
                </>
              ) : (
                <>
                  <FormRow label="Primary goal *">
                    <SelectField value={form.goal} onChange={v => setForm(p => ({ ...p, goal: v }))} options={[["", "Select your goal"], ["Fat Loss", "🔥 Fat Loss"], ["Hypertrophy", "💪 Hypertrophy (Muscle Size)"], ["Strength", "🏋️ Strength (Max Lifts)"], ["Athletic Performance", "⚡ Athletic Performance"], ["General Fitness", "❤️ General Fitness"]]} />
                  </FormRow>
                  <FormRow label="Experience level *">
                    <SelectField value={form.experience} onChange={v => setForm(p => ({ ...p, experience: v }))} options={[["", "Select level"], ["Beginner", "🌱 Beginner (0–1 yr)"], ["Intermediate", "📈 Intermediate (1–3 yrs)"], ["Advanced", "🔥 Advanced (3+ yrs)"]]} />
                  </FormRow>
                  <FormRow label="Training days per week">
                    <SelectField value={form.days} onChange={v => setForm(p => ({ ...p, days: v }))} options={[["", "Select days"], ["3", "3 days/week"], ["4", "4 days/week"], ["5", "5 days/week"], ["6", "6 days/week"]]} />
                  </FormRow>
                  <FormRow label="Equipment access">
                    <SelectField value={form.equipment} onChange={v => setForm(p => ({ ...p, equipment: v }))} options={[["", "Select equipment"], ["Full gym", "🏋️ Full gym (barbells, machines)"], ["Dumbbells only", "🏠 Dumbbells only"], ["Bodyweight only", "🤸 Bodyweight / calisthenics"], ["Resistance bands", "🎗️ Resistance bands"]]} />
                  </FormRow>
                  <FormRow label="Injuries / limitations">
                    <input style={inputSx} type="text" placeholder="e.g. bad knees, lower back pain (leave blank if none)" value={form.injuries} onChange={e => setForm(p => ({ ...p, injuries: e.target.value }))} />
                  </FormRow>
                </>
              )}

              {/* Disclaimer */}
              <div style={{ background: "rgba(77,163,255,0.04)", borderRadius: "12px", padding: "0.875rem", border: "1px solid rgba(77,163,255,0.12)", display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                <input type="checkbox" id="terms" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} style={{ accentColor: "#4DA3FF", width: 16, height: 16, marginTop: 2, cursor: "pointer", flexShrink: 0 }} />
                <label htmlFor="terms" style={{ color: "#6B6F9A", fontSize: "0.78rem", lineHeight: 1.6, cursor: "pointer", userSelect: "none" }}>
                  🛡️ I understand this is an AI-generated educational plan only. It is not medical advice. I will consult a qualified professional before making significant changes to my diet or exercise routine.
                </label>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep("select")} style={{ padding: "0.875rem 1.25rem", borderRadius: "12px", background: "rgba(11,14,22,0.6)", border: "1px solid rgba(77,163,255,0.15)", color: "#AAB3C5", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s" }}>
                  ← Back
                </button>
                <button
                  onClick={handleStart}
                  style={{ flex: 1, padding: "1rem", borderRadius: "14px", background: "linear-gradient(135deg, rgba(77,163,255,0.25), rgba(167,139,250,0.22))", border: "1px solid rgba(77,163,255,0.5)", color: "#66E6FF", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "all 0.25s ease" }}
                >
                  ✨ Generate My {mode === "diet" ? "Diet" : "Workout"} Plan
                </button>
              </div>
            </div>
          )}

          {/* ── CHAT step ── */}
          {step === "chat" && (
            <div className="ac-layout" style={{ display: "flex", height: "calc(100vh - 260px)", minHeight: "520px", maxHeight: "780px" }}>

              {/* Sidebar info */}
              <div className="ac-sidebar" style={{ width: 220, minWidth: 220, padding: "1.5rem", borderRight: "1px solid rgba(77,163,255,0.1)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#66E6FF", letterSpacing: "0.1em", fontWeight: 700 }}>SESSION</div>
                <div style={{ background: "rgba(77,163,255,0.06)", borderRadius: "10px", padding: "0.625rem 0.75rem", border: "1px solid rgba(77,163,255,0.12)" }}>
                  <div style={{ fontSize: "0.7rem", color: "#AAB3C5" }}>Mode</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#66E6FF" }}>{mode === "diet" ? "🥗 Diet Coach" : "💪 Workout Coach"}</div>
                </div>
                {chips.length > 0 && (
                  <div style={{ background: "rgba(167,139,250,0.06)", borderRadius: "10px", padding: "0.625rem 0.75rem", border: "1px solid rgba(167,139,250,0.12)" }}>
                    <div style={{ fontSize: "0.7rem", color: "#AAB3C5", marginBottom: "0.3rem" }}>Preferences</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {chips.map(c => <div key={c} style={{ fontSize: "0.72rem", color: "#C4B5FD" }}>• {c}</div>)}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <button
                    className="ac-export"
                    onClick={() => exportPlan(messages, mode)}
                    style={{ width: "100%", padding: "0.625rem", borderRadius: "10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    ⬇ Download Plan
                  </button>
                  <button onClick={reset} style={{ width: "100%", padding: "0.625rem", borderRadius: "10px", background: "transparent", border: "1px solid rgba(77,163,255,0.15)", color: "#AAB3C5", fontSize: "0.78rem", cursor: "pointer", transition: "all 0.2s" }}>
                    🔄 New Session
                  </button>
                </div>
              </div>

              {/* Chat area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div className="ac-main" style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                  {loading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input bar */}
                <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(77,163,255,0.1)", display: "flex", gap: "0.625rem", alignItems: "center", background: "rgba(7,9,13,0.5)", backdropFilter: "blur(12px)" }}>
                  <input
                    type="text"
                    placeholder={`Ask a follow-up ${mode === "diet" ? "nutrition" : "training"} question…`}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                    style={{ ...inputSx, flex: 1, margin: 0, background: "rgba(11,14,22,0.6)" }}
                  />
                  <button
                    className="ac-send"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    style={{ width: 44, height: 44, borderRadius: "12px", background: "linear-gradient(135deg,#4DA3FF,#A78BFA)", border: "none", color: "#07090D", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: "1rem", transition: "all 0.2s" }}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Lead Gen Card ── */}
        <LeadGenCard />

        {/* ── Disclaimer footer ── */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.72rem", color: "#4A4A6B", lineHeight: 1.6 }}>
          🛡️ Sandy.Lifts AI is for educational purposes only. Always consult a qualified healthcare professional before starting a new diet or exercise programme.
        </div>
      </div>
    </div>
  );
}

/* ─── Mini helpers ───────────────────────────────────────── */
const inputSx: React.CSSProperties = {
  width: "100%", padding: "0.8rem 1rem",
  background: "rgba(11,14,22,0.8)", border: "1px solid rgba(77,163,255,0.15)",
  borderRadius: "12px", color: "#F5F7FA", fontSize: "0.9rem",
  outline: "none", transition: "border-color 0.2s",
  fontFamily: "inherit",
};

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#AAB3C5", display: "block", marginBottom: "0.4rem" }}>{label}</label>
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...inputSx, appearance: "none", cursor: "pointer" }}
    >
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}