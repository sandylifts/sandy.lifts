"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface WomenForm {
  name: string; age: string; height: string; weight: string; bodyType: string;
  healthConditions: string[]; periodsRegular: string; lastCycleDate: string;
  pregnancyHistory: string; medicines: string;
  sleepHours: string; stressLevel: number; waterIntake: string; jobType: string;
  foodType: string; mealsPerDay: string; foodDislikes: string; junkHabit: string; lateNightEating: string;
  experience: string; currentActivity: string; timeAvailable: string; workoutPlace: string;
  mainGoal: string; focusArea: string[]; targetInMonth: string; whyTransform: string;
  comments: string; referredBy: string; referrerName: string;
}

const INIT: WomenForm = {
  name:"", age:"", height:"", weight:"", bodyType:"",
  healthConditions:[], periodsRegular:"", lastCycleDate:"", pregnancyHistory:"", medicines:"",
  sleepHours:"", stressLevel:5, waterIntake:"", jobType:"",
  foodType:"", mealsPerDay:"", foodDislikes:"", junkHabit:"", lateNightEating:"",
  experience:"", currentActivity:"", timeAvailable:"", workoutPlace:"",
  mainGoal:"", focusArea:[], targetInMonth:"", whyTransform:"",
  comments:"", referredBy:"", referrerName:"",
};

const STEPS = [
  { title:"Basic Info",      icon:"👤", sub:"Let's start with the basics" },
  { title:"Health",          icon:"💊", sub:"Your health history keeps you safe" },
  { title:"Lifestyle",       icon:"🌙", sub:"Tell us about your daily routine" },
  { title:"Diet",            icon:"🥗", sub:"What does your eating look like?" },
  { title:"Fitness",         icon:"💪", sub:"Your current activity level" },
  { title:"Your Goal",       icon:"🎯", sub:"What do you want to achieve?" },
  { title:"Review & Submit", icon:"✅", sub:"Check your answers and send!" },
];

const P   = "#E5989B";          // pink — glow + progress bar + CTA + checkmarks only
const PL  = "#E8D0CE";          // soft blush for labels
const PBG = "rgba(255,255,255,0.06)";   // neutral selected btn bg
const PBD = "rgba(255,255,255,0.18)";   // neutral selected btn border

// ── Module-level atoms (MUST be outside component to avoid remount on re-render) ──

function WLabel({ t }: { t: string }) {
  return <p style={{ fontSize:"0.82rem", fontWeight:600, color:"#A0A8B4", marginBottom:"0.45rem", margin:"0 0 0.45rem 0" }}>{t}</p>;
}

function WGrid({ children, cols=2 }: { children: React.ReactNode; cols?: number }) {
  return <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:"0.5rem" }}>{children}</div>;
}

function WErrMsg({ err }: { err?: string }) {
  return err ? <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.4rem" }}>{err}</p> : null;
}

function WBtn({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      style={{ padding:"0.55rem 0.9rem", borderRadius:"10px", fontSize:"0.85rem",
        fontWeight: selected ? 600 : 400, cursor:"pointer", textAlign:"left",
        background: selected ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.025)",
        border:`1px solid ${selected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
        color: selected ? "#F5F7FA" : "#6B7280",
        boxShadow: selected ? `0 0 12px rgba(229,152,155,0.18)` : "none",
        transition:"all 0.18s ease" }}>
      {selected && <span style={{ color:P, marginRight:"0.35rem" }}>✓</span>}{label}
    </button>
  );
}

function WTextInput({ value, error, placeholder, type="text", onChange }: {
  value: string; error?: string; placeholder: string; type?: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
          background:"rgba(255,255,255,0.04)", border:`1px solid ${error ? "#FF4444" : "rgba(255,255,255,0.1)"}`,
          color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
      {error && <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.25rem" }}>{error}</p>}
    </div>
  );
}

function WTextarea({ value, placeholder, onChange }: {
  value: string; placeholder: string; onChange: (v: string) => void;
}) {
  return (
    <textarea value={value} placeholder={placeholder} rows={3}
      onChange={e => onChange(e.target.value)}
      style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
        color:"#F5F7FA", outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }} />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function WomenIntakeForm() {
  const [step, setStep] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);
  const [fd, setFd] = useState<WomenForm>(INIT);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [weightUnit, setWeightUnit] = useState<"kg"|"lbs">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm"|"ftin">("cm");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("intake_step_women");
    if (s) setStep(parseInt(s, 10));
  }, []);

  useEffect(() => {
    if (submitted) {
      localStorage.removeItem("intake_step_women");
    } else {
      localStorage.setItem("intake_step_women", step.toString());
    }
  }, [step, submitted]);

  const set = (f: keyof WomenForm, v: string) => {
    setFd(p => ({ ...p, [f]: v }));
    setErrs(p => ({ ...p, [f]: "" }));
  };
  const toggle = (f: keyof WomenForm, v: string) =>
    setFd(p => {
      const arr = p[f] as string[];
      return { ...p, [f]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] };
    });

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!fd.name.trim()) e.name = "Required";
      if (!fd.age.trim())  e.age  = "Required";
      if (!fd.height.trim()) e.height = "Required";
      if (!fd.weight.trim()) e.weight = "Required";
      if (!fd.bodyType) e.bodyType = "Please select";
    }
    if (step === 2) {
      if (!fd.healthConditions.length) e.healthConditions = "Select at least one";
      if (!fd.periodsRegular) e.periodsRegular = "Please answer";
      if (!fd.pregnancyHistory) e.pregnancyHistory = "Please select";
    }
    if (step === 3) {
      if (!fd.sleepHours) e.sleepHours = "Please select";
      if (!fd.waterIntake) e.waterIntake = "Please select";
      if (!fd.jobType) e.jobType = "Please select";
    }
    if (step === 4) {
      if (!fd.foodType) e.foodType = "Please select";
      if (!fd.mealsPerDay) e.mealsPerDay = "Please select";
      if (!fd.junkHabit) e.junkHabit = "Please select";
      if (!fd.lateNightEating) e.lateNightEating = "Please select";
    }
    if (step === 5) {
      if (!fd.experience) e.experience = "Please select";
      if (!fd.currentActivity) e.currentActivity = "Please select";
      if (!fd.timeAvailable) e.timeAvailable = "Please select";
      if (!fd.workoutPlace) e.workoutPlace = "Please select";
    }
    if (step === 6) {
      if (!fd.mainGoal) e.mainGoal = "Please select your goal";
      if (!fd.focusArea.length) e.focusArea = "Select at least one";
    }
    setErrs(e);
    return !Object.keys(e).length;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 7)); };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (!fd.referredBy) {
      setErrs(p => ({ ...p, referredBy: "Please select who referred you" }));
      return;
    }
    if ((fd.referredBy === "Friend / Client 👥" || fd.referredBy === "Other 🌟") && !fd.referrerName.trim()) {
      setErrs(p => ({ ...p, referrerName: "Required" }));
      return;
    }

    setSubmitting(true);
    setAnalyzing(true);
    setAnalyzeProgress(0);
    
    // Fire and forget API call so it doesn't block loading/transition
    fetch("/api/intake", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ gender:"women", formData: fd }),
    }).catch(() => {});

    // High fidelity AI scanning engine simulation over 2.5s
    const interval = setInterval(() => {
      setAnalyzeProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setSubmitted(true);
          setSubmitting(false);
          return 100;
        }
        return prev + 4;
      });
    }, 100);
  };

  const handleWeightUnitChange = (unit: "kg"|"lbs") => {
    if (unit === weightUnit) return;
    const val = parseFloat(fd.weight);
    if (!isNaN(val) && fd.weight.trim()) {
      const conv = unit === "lbs" ? (val * 2.2046).toFixed(1) : (val / 2.2046).toFixed(1);
      set("weight", conv);
    }
    setWeightUnit(unit);
  };

  const handleHeightUnitChange = (unit: "cm"|"ftin") => {
    if (unit === heightUnit) return;
    if (unit === "ftin") {
      const cm = parseFloat(fd.height);
      if (!isNaN(cm) && fd.height.trim()) {
        const totalIn = cm / 2.54;
        const ft = Math.floor(totalIn / 12);
        const inch = Math.round(totalIn % 12);
        setHeightFt(ft.toString());
        setHeightIn(inch.toString());
        set("height", `${ft} ft ${inch} in`);
      }
    } else {
      if (heightFt.trim()) {
        const cm = Math.round(parseInt(heightFt||"0") * 30.48 + parseInt(heightIn||"0") * 2.54);
        set("height", cm.toString());
      }
      setHeightFt(""); setHeightIn("");
    }
    setHeightUnit(unit);
  };

  const unitBtn = (label: string, active: boolean, onClick: () => void) => (
    <button key={label} type="button" onClick={onClick}
      style={{ padding:"0.15rem 0.5rem", borderRadius:"5px", fontSize:"0.68rem", fontWeight:700,
        cursor:"pointer", textTransform:"uppercase",
        border:`1px solid ${active ? PBD : "rgba(255,255,255,0.1)"}`,
        background: active ? PBG : "transparent",
        color: active ? PL : "#6B7280", transition:"all 0.15s" }}>
      {label}
    </button>
  );

  const renderStep = () => {
    if (step === 1) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <WLabel t="Your Name *" />
          <WTextInput value={fd.name} error={errs.name} placeholder="e.g. Simranjeet Kaur" onChange={v => set("name", v)} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
          <div>
            <WLabel t="Age *" />
            <WTextInput value={fd.age} error={errs.age} placeholder="e.g. 26" type="number" onChange={v => set("age", v)} />
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.45rem" }}>
              <WLabel t="Weight *" />
              <div style={{ display:"flex", gap:"0.2rem" }}>
                {unitBtn("kg", weightUnit==="kg", () => handleWeightUnitChange("kg"))}
                {unitBtn("lbs", weightUnit==="lbs", () => handleWeightUnitChange("lbs"))}
              </div>
            </div>
            <input type="number" value={fd.weight} placeholder={weightUnit==="kg" ? "e.g. 65" : "e.g. 143"}
              onChange={e => set("weight", e.target.value)}
              style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
                background:"rgba(255,255,255,0.04)", border:`1px solid ${errs.weight ? "#FF4444" : "rgba(255,255,255,0.1)"}`,
                color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
            {errs.weight && <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.25rem" }}>{errs.weight}</p>}
          </div>
        </div>
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.45rem" }}>
            <WLabel t="Height *" />
            <div style={{ display:"flex", gap:"0.2rem" }}>
              {unitBtn("cm", heightUnit==="cm", () => handleHeightUnitChange("cm"))}
              {unitBtn("ft/in", heightUnit==="ftin", () => handleHeightUnitChange("ftin"))}
            </div>
          </div>
          {heightUnit === "cm" ? (
            <div>
              <input type="number" value={fd.height} placeholder="e.g. 162"
                onChange={e => set("height", e.target.value)}
                style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
                  background:"rgba(255,255,255,0.04)", border:`1px solid ${errs.height ? "#FF4444" : "rgba(255,255,255,0.1)"}`,
                  color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
              {errs.height && <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.25rem" }}>{errs.height}</p>}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              <input type="number" value={heightFt} placeholder="Feet (e.g. 5)"
                onChange={e => { setHeightFt(e.target.value); set("height", `${e.target.value} ft ${heightIn} in`); }}
                style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
                  background:"rgba(255,255,255,0.04)", border:`1px solid ${errs.height ? "#FF4444" : "rgba(255,255,255,0.1)"}`,
                  color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
              <input type="number" value={heightIn} placeholder="Inches (e.g. 3)"
                onChange={e => { setHeightIn(e.target.value); set("height", `${heightFt} ft ${e.target.value} in`); }}
                style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
                  color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
              {errs.height && <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.25rem", gridColumn:"1/-1" }}>{errs.height}</p>}
            </div>
          )}
        </div>
        <div>
          <WLabel t="Body Type *" />
          <WGrid>
            {["Slim","Average","Heavy","Apple-shaped","Pear-shaped"].map(v => (
              <WBtn key={v} selected={fd.bodyType===v} label={v} onClick={() => set("bodyType", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.bodyType} />
        </div>
      </div>
    );

    if (step === 2) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <WLabel t="Health conditions (select all that apply) *" />
          <WGrid>
            {["PCOS/PCOD","Thyroid","High BP","Diabetes","Hormonal imbalance","None"].map(v => (
              <WBtn key={v} selected={fd.healthConditions.includes(v)} label={v} onClick={() => toggle("healthConditions", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.healthConditions} />
        </div>
        <div>
          <WLabel t="Are your periods regular? *" />
          <WGrid>
            {["Yes, regular","No, irregular"].map(v => (
              <WBtn key={v} selected={fd.periodsRegular===v} label={v} onClick={() => set("periodsRegular", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.periodsRegular} />
        </div>
        {fd.periodsRegular === "No, irregular" && (
          <div>
            <WLabel t="Last cycle date (approx.)" />
            <WTextInput value={fd.lastCycleDate} placeholder="e.g. 11 April" onChange={v => set("lastCycleDate", v)} />
          </div>
        )}
        <div>
          <WLabel t="Pregnancy history *" />
          <WGrid>
            {["Never","Yes, in the past","Currently pregnant"].map(v => (
              <WBtn key={v} selected={fd.pregnancyHistory===v} label={v} onClick={() => set("pregnancyHistory", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.pregnancyHistory} />
        </div>
        <div>
          <WLabel t="Medicines / Supplements (if any)" />
          <WTextarea value={fd.medicines} placeholder="e.g. Homeopathic, Iron tablets, None..." onChange={v => set("medicines", v)} />
        </div>
      </div>
    );

    if (step === 3) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <WLabel t="Average sleep per night *" />
          <WGrid>
            {["Less than 5 hrs","5–6 hrs","7–8 hrs","8+ hrs"].map(v => (
              <WBtn key={v} selected={fd.sleepHours===v} label={v} onClick={() => set("sleepHours", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.sleepHours} />
        </div>
        <div>
          <WLabel t={`Stress level: ${fd.stressLevel}/10`} />
          <input type="range" min={1} max={10} value={fd.stressLevel}
            onChange={e => setFd(p => ({ ...p, stressLevel: parseInt(e.target.value) }))}
            style={{ width:"100%", accentColor: P }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.72rem", color:"#8B909E" }}>
            <span>😌 Very calm</span><span>😰 Very stressed</span>
          </div>
        </div>
        <div>
          <WLabel t="Daily water intake *" />
          <WGrid>
            {["Less than 1L","1–2L","2–3L","3L+"].map(v => (
              <WBtn key={v} selected={fd.waterIntake===v} label={v} onClick={() => set("waterIntake", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.waterIntake} />
        </div>
        <div>
          <WLabel t="Your lifestyle / job type *" />
          <WGrid>
            {["Stay at home","College student","Desk / office job","Active field job"].map(v => (
              <WBtn key={v} selected={fd.jobType===v} label={v} onClick={() => set("jobType", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.jobType} />
        </div>
      </div>
    );

    if (step === 4) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <WLabel t="Food preference *" />
          <WGrid>
            {["Vegetarian 🥦","Eggetarian 🥚","Non-vegetarian 🍗","Vegan 🌱"].map(v => (
              <WBtn key={v} selected={fd.foodType===v} label={v} onClick={() => set("foodType", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.foodType} />
        </div>
        <div>
          <WLabel t="Meals per day *" />
          <WGrid>
            {["1–2 meals","3 meals","4–5 meals","Skip meals often"].map(v => (
              <WBtn key={v} selected={fd.mealsPerDay===v} label={v} onClick={() => set("mealsPerDay", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.mealsPerDay} />
        </div>
        <div>
          <WLabel t="Food dislikes / can't eat" />
          <WTextarea value={fd.foodDislikes} placeholder="e.g. Bhindi, bitter gourd, mushrooms..." onChange={v => set("foodDislikes", v)} />
        </div>
        <div>
          <WLabel t="Junk food / chai habit *" />
          <WGrid>
            {["Daily ☕","Occasionally","Rarely","Clean eating ✓"].map(v => (
              <WBtn key={v} selected={fd.junkHabit===v} label={v} onClick={() => set("junkHabit", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.junkHabit} />
        </div>
        <div>
          <WLabel t="Late night eating? *" />
          <WGrid>
            {["Yes, regularly","Sometimes","No"].map(v => (
              <WBtn key={v} selected={fd.lateNightEating===v} label={v} onClick={() => set("lateNightEating", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.lateNightEating} />
        </div>
      </div>
    );

    if (step === 5) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <WLabel t="Fitness experience *" />
          <WGrid>
            {["Beginner 🌱","Tried & left","6+ months","1+ year 💪"].map(v => (
              <WBtn key={v} selected={fd.experience===v} label={v} onClick={() => set("experience", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.experience} />
        </div>
        <div>
          <WLabel t="Current activity *" />
          <WGrid>
            {["Daily walk 🚶‍♀️","Yoga 🧘‍♀️","Gym 🏋️‍♀️","Nothing currently"].map(v => (
              <WBtn key={v} selected={fd.currentActivity===v} label={v} onClick={() => set("currentActivity", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.currentActivity} />
        </div>
        <div>
          <WLabel t="Time you can give daily *" />
          <WGrid>
            {["15 min","30 min","45 min","60+ min ⚡"].map(v => (
              <WBtn key={v} selected={fd.timeAvailable===v} label={v} onClick={() => set("timeAvailable", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.timeAvailable} />
        </div>
        <div>
          <WLabel t="Workout place *" />
          <WGrid>
            {["Home 🏠","Gym 🏋️‍♀️","Outdoor / Park"].map(v => (
              <WBtn key={v} selected={fd.workoutPlace===v} label={v} onClick={() => set("workoutPlace", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.workoutPlace} />
        </div>
      </div>
    );

    if (step === 6) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <WLabel t="Main goal *" />
          <WGrid>
            {["Fat Loss 🔥","Body Toning ✨","Muscle Building 💪","Overall Fitness 🎯"].map(v => (
              <WBtn key={v} selected={fd.mainGoal===v} label={v} onClick={() => set("mainGoal", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.mainGoal} />
        </div>
        <div>
          <WLabel t="Focus area (select all that apply) *" />
          <WGrid>
            {["Belly 🎯","Thighs","Arms","Overall","Better posture"].map(v => (
              <WBtn key={v} selected={fd.focusArea.includes(v)} label={v} onClick={() => toggle("focusArea", v)} />
            ))}
          </WGrid>
          <WErrMsg err={errs.focusArea} />
        </div>
        <div>
          <WLabel t="Target in 1 month" />
          <WTextInput value={fd.targetInMonth} placeholder="e.g. Lose 2 kg, tone my belly" onChange={v => set("targetInMonth", v)} />
        </div>
        <div>
          <WLabel t="Why do you want to transform?" />
          <WTextarea value={fd.whyTransform} placeholder="Share your motivation — it helps Sandy build a better plan for you..." onChange={v => set("whyTransform", v)} />
        </div>
      </div>
    );

    if (step === 7) {
      const Section = ({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) => (
        <div style={{ marginBottom:"0.75rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.45rem 0.75rem", borderRadius:"8px", background:"rgba(255,255,255,0.04)", marginBottom:"0.35rem" }}>
            <span style={{ fontSize:"0.85rem" }}>{emoji}</span>
            <span style={{ fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:PL }}>{title}</span>
          </div>
          {children}
        </div>
      );
      const Row = ({ icon, label, value }: { icon: string; label: string; value: string }) => value ? (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.42rem 0.75rem", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:"0.82rem" }}>
          <span style={{ display:"flex", alignItems:"center", gap:"0.45rem", color:"#8B909E", flexShrink:0 }}>
            <span style={{ fontSize:"0.78rem" }}>{icon}</span>{label}
          </span>
          <span style={{ color:"#F5F7FA", fontWeight:600, textAlign:"right", maxWidth:"58%", lineHeight:1.3 }}>{value}</span>
        </div>
      ) : null;

      return (
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {!submitted ? (
            <>
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"0.85rem", overflow:"hidden" }}>
                <Section emoji="👤" title="Personal Profile">
                  <Row icon="🪪" label="Name" value={fd.name} />
                  <Row icon="🎂" label="Age" value={fd.age ? fd.age+" yrs" : ""} />
                  <Row icon="📏" label="Height / Weight" value={`${heightUnit==="cm" ? fd.height+" cm" : fd.height} / ${fd.weight} ${weightUnit}`} />
                  <Row icon="🪞" label="Body Type" value={fd.bodyType} />
                </Section>
                <Section emoji="🏥" title="Health">
                  <Row icon="💊" label="Conditions" value={fd.healthConditions.join(", ")||"None"} />
                  <Row icon="🌸" label="Periods" value={fd.periodsRegular} />
                  <Row icon="😴" label="Sleep" value={fd.sleepHours} />
                  <Row icon="💧" label="Water Intake" value={fd.waterIntake} />
                </Section>
                <Section emoji="🌙" title="Lifestyle & Diet">
                  <Row icon="💼" label="Job / Role" value={fd.jobType} />
                  <Row icon="🥗" label="Food Preference" value={fd.foodType} />
                  <Row icon="🍽️" label="Meals / Day" value={fd.mealsPerDay} />
                  <Row icon="🍟" label="Junk Habit" value={fd.junkHabit} />
                  <Row icon="🌙" label="Late Night Eating" value={fd.lateNightEating} />
                </Section>
                <Section emoji="💪" title="Fitness">
                  <Row icon="🏅" label="Experience" value={fd.experience} />
                  <Row icon="🏃‍♀️" label="Current Activity" value={fd.currentActivity} />
                  <Row icon="⏱️" label="Time Available" value={fd.timeAvailable} />
                  <Row icon="📍" label="Workout Place" value={fd.workoutPlace} />
                </Section>
                <Section emoji="🎯" title="Goals">
                  <Row icon="🔥" label="Main Goal" value={fd.mainGoal} />
                  <Row icon="📌" label="Focus Area" value={fd.focusArea.join(", ")} />
                  <Row icon="📅" label="1-Month Target" value={fd.targetInMonth} />
                  <Row icon="💬" label="Motivation" value={fd.whyTransform} />
                </Section>
              </div>

              <div>
                <WLabel t="Anything else you want Sandy to know?" />
                <WTextarea value={fd.comments} placeholder="Any extra details, questions, or special requests..." onChange={v => set("comments", v)} />
              </div>

              <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
                <WLabel t="Who referred you to Sandy.Lifts? *" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  {[
                    { key: "Instagram 📱", label: "Instagram 📱" },
                    { key: "YouTube 🎥", label: "YouTube 🎥" },
                    { key: "Friend / Client 👥", label: "Friend / Client 👥" },
                    { key: "Other 🌟", label: "Other 🌟" }
                  ].map(item => (
                    <WBtn key={item.key} selected={fd.referredBy === item.key} label={item.label} onClick={() => set("referredBy", item.key)} />
                  ))}
                </div>
                <WErrMsg err={errs.referredBy} />

                {/* Conditional Slide-out text field */}
                {(fd.referredBy === "Friend / Client 👥" || fd.referredBy === "Other 🌟") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                    style={{ marginTop: "0.75rem" }}
                  >
                    <WLabel t="What is their name? / Where did you find us? *" />
                    <WTextInput
                      value={fd.referrerName}
                      error={errs.referrerName}
                      placeholder="Enter details here..."
                      onChange={v => set("referrerName", v)}
                    />
                  </motion.div>
                )}
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <button type="button" onClick={handleSubmit} disabled={submitting}
                  style={{ width:"100%", padding:"1rem", borderRadius:"14px", fontWeight:700, fontSize:"1rem",
                    cursor:submitting ? "wait" : "pointer", border:"none",
                    background:`linear-gradient(135deg, ${P}, #F5CAC3)`,
                    color:"#07090D", boxShadow:`0 0 30px rgba(229,152,155,0.4)`, opacity:submitting ? 0.7 : 1,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem" }}>
                  Submit Fitness Profile ⚡
                </button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 18 }}
              style={{ display:"flex", flexDirection:"column", gap:"1.5rem", position: "relative" }}
            >
              {/* Confetti Particle Sparkles */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
                <style>{`
                  @keyframes floating-confetti {
                    0% { transform: translateY(20px) rotate(0deg); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 0.8; }
                    100% { transform: translateY(-120px) rotate(360deg); opacity: 0; }
                  }
                `}</style>
                {/* Float particles */}
                {["✨", "🎉", "🌸", "💪", "✨", "🌸"].map((char, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    bottom: "20%",
                    left: `${15 + i * 14}%`,
                    fontSize: `${1.2 + (i%3)*0.3}rem`,
                    animation: `floating-confetti ${3.2 + (i%2)*1.2}s ease-in-out infinite ${i * 0.4}s`,
                    opacity: 0,
                    pointerEvents: "none"
                  }}>{char}</div>
                ))}
              </div>

              {/* Success Title */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.35 }}
                style={{ textAlign:"center", marginBottom:"0.5rem", position: "relative", zIndex: 10 }}
              >
                <div style={{ fontSize:"3.5rem", marginBottom:"0.5rem", animation: "fpulse 2s infinite" }}>🎉</div>
                <h2 style={{ background:`linear-gradient(135deg, ${P}, #F5CAC3)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:900, fontSize:"1.8rem", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  Assessment Confirmed!
                </h2>
                <p style={{ color:"#AAB3C5", fontSize:"0.95rem", margin:0 }}>
                  You just made the decision that separates the top 1% from everyone else.
                </p>
              </motion.div>

              {/* DUAL ACTION CARDS ROW */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1.25rem", width:"100%", position: "relative", zIndex: 10 }}>
                
                {/* CARD 1: WHATSAPP FAST-TRACK */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.12, duration: 0.6, type: "spring", stiffness: 120, damping: 15 }}
                  whileHover={{ y: -6, scale: 1.015, border: "1px solid rgba(34,197,94,0.4)", boxShadow: "0 20px 40px rgba(34,197,94,0.12)", transition: { duration: 0.2 } }}
                  style={{
                    background: "linear-gradient(145deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    borderRadius: "24px",
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.6), 0 0 30px rgba(34,197,94,0.05)",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer"
                  }}
                >
                  {/* Neon light behind card */}
                  <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"120px", height:"120px", borderRadius:"50%", background:"radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)", pointerEvents:"none" }} />
                  
                  <div>
                    {/* Live Online Badge */}
                    <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.4)", borderRadius:"999px", padding:"0.25rem 0.75rem", fontSize:"0.65rem", fontWeight:800, color:"#4ADE80", marginBottom:"1.25rem", letterSpacing:"0.05em", textTransform:"uppercase" }}>
                      <span className="relative flex h-2.5 w-2.5 shrink-0 mr-1.5" style={{ display: "inline-flex", position: "relative" }}>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" style={{ position: "absolute", borderRadius: "50%", width: "100%", height: "100%" }}></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E] shadow-[0_0_8px_#22C55E]" style={{ position: "relative", borderRadius: "50%", width: "10px", height: "10px" }}></span>
                      </span>
                      🟢 Coach Sandy: Active Now
                    </div>

                    <h3 style={{ fontSize:"1.2rem", fontWeight:900, color:"#fff", margin:"0 0 0.5rem" }}>Priority Plan Fast-Track</h3>
                    <p style={{ fontSize:"0.82rem", color:"#9A9EC4", lineHeight:1.5, margin:"0 0 1.5rem" }}>
                      Send your assessment alert to Sandy directly via WhatsApp. Bypasses the standard queue and initiates **instant 15-minute priority review**!
                    </p>
                  </div>

                  <div>
                    {/* WhatsApp Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        let refStr = "";
                        if (fd.referredBy && fd.referredBy !== "No one (Found it myself)") {
                          refStr = `\nReferred By: ${fd.referredBy}` + (fd.referrerName ? ` (${fd.referrerName})` : "");
                        }
                        const msg = encodeURIComponent(`Hi Sandy! 💪 I just filled my women's fitness assessment form on your website.\n\nName: ${fd.name}\nAge: ${fd.age} yrs\nGoal: ${fd.mainGoal}\nHealth: ${fd.healthConditions.join(", ")||"None"}${refStr}\n\nPlease review my details and create my personalised plan 🙏\n\nI'll explore the website again to see the rest of your amazing tools! Thank you so much! ✨`);
                        window.open(`https://wa.me/918968244407?text=${msg}`, "_blank");
                      }}
                      style={{
                        width: "100%",
                        padding: "1rem",
                        borderRadius: "14px",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        border: "none",
                        background: "linear-gradient(135deg, #22C55E 0%, #10B981 100%)",
                        color: "#fff",
                        boxShadow: "0 0 24px rgba(34,197,94,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "transform 0.2s"
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.059-3.486c1.656.983 3.284 1.503 4.966 1.504 5.539 0 10.05-4.47 10.054-9.974.002-2.668-1.036-5.176-2.923-7.066C16.329 3.088 13.829 2.05 11.166 2.05 5.627 2.05 1.118 6.52 1.114 12.023c-.001 1.76.476 3.479 1.383 5.048L1.442 21.6l4.674-1.086z"/></svg>
                      Notify Sandy on WhatsApp
                    </button>
                    <p style={{ textAlign:"center", fontSize:"0.72rem", color:"#4ADE80", marginTop:"0.6rem", fontWeight:600 }}>
                      ⚡ Instant Response Enabled
                    </p>
                  </div>
                </motion.div>

                {/* CARD 2: SUPPLEMENT PREVIEW & EXTRA TOOLS */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.24, duration: 0.6, type: "spring", stiffness: 120, damping: 15 }}
                  whileHover={{ y: -6, scale: 1.015, border: `1px solid rgba(229,152,155,0.18)`, boxShadow: "0 20px 40px rgba(229,152,155,0.06)", transition: { duration: 0.2 } }}
                  style={{
                    background: "linear-gradient(145deg, rgba(229,152,155,0.06) 0%, rgba(229,152,155,0.01) 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "24px",
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                    cursor: "pointer"
                  }}
                >
                  <div>
                    <h3 style={{ fontSize:"1.2rem", fontWeight:900, color:"#fff", margin:"0 0 0.5rem" }}>Explore Personalized Preview</h3>
                    <p style={{ fontSize:"0.82rem", color:"#9A9EC4", lineHeight:1.5, margin:"0 0 1.25rem" }}>
                      While Sandy reviews your form, don&apos;t wait! Unlock supplementary recommendation widgets matched directly to your primary goal:
                    </p>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem", width:"100%" }}>
                    
                    {/* Link 1: SUPPLEMENT PITCH PORTAL */}
                    <Link href="/admin" style={{ textDecoration:"none" }}>
                      <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"0.65rem 0.85rem", display:"flex", alignItems:"center", gap:"0.75rem", transition:"all 0.18s", cursor:"pointer" }}>
                        <span style={{ fontSize:"1.1rem" }}>💊</span>
                        <div style={{ display:"flex", flexDirection:"column" }}>
                          <span style={{ color:"#fff", fontWeight:700, fontSize:"0.8rem" }}>Supplement Recommendations</span>
                          <span style={{ color:"#8B909E", fontSize:"0.68rem" }}>MuscleBlaze & ON Media Previews</span>
                        </div>
                      </div>
                    </Link>

                    {/* Link 2: AI COACH */}
                    <Link href="/ai-coach" style={{ textDecoration:"none" }}>
                      <div style={{ background:"rgba(167,139,250,0.05)", border:"1px solid rgba(167,139,250,0.18)", borderRadius:"14px", padding:"0.65rem 0.85rem", display:"flex", alignItems:"center", gap:"0.75rem", transition:"all 0.18s", cursor:"pointer" }}>
                        <span style={{ fontSize:"1.1rem" }}>🤖</span>
                        <div style={{ display:"flex", flexDirection:"column" }}>
                          <span style={{ color:"#fff", fontWeight:700, fontSize:"0.8rem" }}>Ask Sandy&apos;s AI Coach</span>
                          <span style={{ color:"#C084FC", fontSize:"0.68rem" }}>Pre-loaded with your goals for instant chat</span>
                        </div>
                      </div>
                    </Link>

                    {/* Link 3: BODY TYPE QUIZ */}
                    <Link href="/tools/body-type-quiz" style={{ textDecoration:"none" }}>
                      <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"0.65rem 0.85rem", display:"flex", alignItems:"center", gap:"0.75rem", transition:"all 0.18s", cursor:"pointer" }}>
                        <span style={{ fontSize:"1.1rem" }}>🧬</span>
                        <div style={{ display:"flex", flexDirection:"column" }}>
                          <span style={{ color:"#fff", fontWeight:700, fontSize:"0.8rem" }}>Scientific Body Type Quiz</span>
                          <span style={{ color:"#8B909E", fontSize:"0.68rem" }}>Explore DNA matching categories</span>
                        </div>
                      </div>
                    </Link>

                  </div>
                </motion.div>

              </div>

              {/* Return Home Link */}
              <Link href="/" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem", background:`rgba(255,255,255,0.03)`, color:"#8B909E", fontWeight:600, fontSize:"0.85rem", padding:"0.85rem", borderRadius:"12px", textDecoration:"none", border:"1px solid rgba(255,255,255,0.07)", width:"100%", boxSizing:"border-box", textAlign:"center", position: "relative", zIndex: 10 }}>
                ← Return to Home Dashboard
              </Link>
            </motion.div>
          )}
        </div>
      );
    }
    return null;
  };

  const progress = ((step - 1) / 6) * 100;

  return (
    <div style={{ minHeight:"100vh", background:"#07090D", paddingTop:"80px", paddingBottom:"60px" }}>
      {/* ── Static glows ── */}
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, pointerEvents:"none", background:"radial-gradient(ellipse 90% 60% at 50% -5%, rgba(229,152,155,0.22) 0%, transparent 58%)" }} />
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"700px", height:"340px", pointerEvents:"none", background:"radial-gradient(ellipse at bottom, rgba(229,152,155,0.10) 0%, transparent 68%)" }} />

      {/* ── Animated decorative layer ── */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <style>{`
          @keyframes fpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
          @keyframes bf-float-a { 0%,100%{transform:translateY(0px) translateX(0px) rotate(-4deg)} 40%{transform:translateY(-24px) translateX(7px) rotate(5deg)} 70%{transform:translateY(-10px) translateX(-4px) rotate(-1deg)} }
          @keyframes bf-float-b { 0%,100%{transform:translateY(0px) rotate(3deg)} 50%{transform:translateY(-20px) translateX(-6px) rotate(-4deg)} }
          @keyframes bf-flutter { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.72)} }
          @keyframes sp-twinkle { 0%,100%{opacity:0;transform:scale(0.4)} 30%,70%{opacity:1;transform:scale(1.3)} 50%{opacity:0.7;transform:scale(1)} }
          @keyframes orb-drift  { 0%,100%{transform:translate(0px,0px)} 50%{transform:translate(28px,-18px)} }
          @keyframes wcta-shine { 0%{transform:translateX(-130%)} 55%,100%{transform:translateX(130%)} }
          @keyframes wcta-glow  { 0%,100%{box-shadow:0 4px 0 rgba(185,55,75,0.4),0 8px 28px rgba(229,152,155,0.55),0 0 55px rgba(229,152,155,0.18)} 50%{box-shadow:0 4px 0 rgba(185,55,75,0.4),0 10px 38px rgba(229,152,155,0.75),0 0 80px rgba(229,152,155,0.32)} }
          @keyframes wcta-ring  { 0%,100%{opacity:0;transform:scale(1)} 40%,60%{opacity:0.7} 50%{opacity:0.4;transform:scale(1.06)} }
          .wcta-btn { animation: wcta-glow 2.8s ease-in-out infinite; transition: transform 0.12s ease, box-shadow 0.12s ease !important; }
          .wcta-btn:hover { transform: translateY(-3px) !important; }
          .wcta-btn:active { transform: translateY(3px) !important; box-shadow: 0 1px 0 rgba(185,55,75,0.4), 0 4px 14px rgba(229,152,155,0.4) !important; }
        `}</style>

        {/* Soft drifting orbs */}
        <div style={{ position:"absolute", top:"8%", left:"-8%", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle, rgba(229,152,155,0.07) 0%, transparent 65%)", animation:"orb-drift 14s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"-6%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(229,152,155,0.05) 0%, transparent 65%)", animation:"orb-drift 18s ease-in-out infinite reverse 3s" }} />

        {/* Butterfly 1 — large, top-left */}
        <div style={{ position:"absolute", top:"16%", left:"5%", animation:"bf-float-a 7.5s ease-in-out infinite" }}>
          <svg width="56" height="38" viewBox="0 0 100 68" style={{ animation:"bf-flutter 1.3s ease-in-out infinite", display:"block" }}>
            <path d="M50 34 C35 17, 8 15, 5 28 C2 40, 18 52, 34 45 C43 41, 48 38, 50 34Z" fill="#E5989B" opacity="0.22"/>
            <path d="M50 34 C39 41, 25 50, 21 60 C19 66, 30 69, 39 62 C47 55, 49 43, 50 34Z" fill="#E5989B" opacity="0.15"/>
            <path d="M50 34 C65 17, 92 15, 95 28 C98 40, 82 52, 66 45 C57 41, 52 38, 50 34Z" fill="#E5989B" opacity="0.22"/>
            <path d="M50 34 C61 41, 75 50, 79 60 C81 66, 70 69, 61 62 C53 55, 51 43, 50 34Z" fill="#E5989B" opacity="0.15"/>
            <ellipse cx="50" cy="37" rx="2" ry="7" fill="#E5989B" opacity="0.28"/>
          </svg>
        </div>

        {/* Butterfly 2 — medium, right-middle */}
        <div style={{ position:"absolute", top:"42%", right:"4%", animation:"bf-float-b 9s ease-in-out infinite 2s" }}>
          <svg width="38" height="26" viewBox="0 0 100 68" style={{ animation:"bf-flutter 1.6s ease-in-out infinite 0.4s", display:"block" }}>
            <path d="M50 34 C35 17, 8 15, 5 28 C2 40, 18 52, 34 45 C43 41, 48 38, 50 34Z" fill="#E5989B" opacity="0.17"/>
            <path d="M50 34 C39 41, 25 50, 21 60 C19 66, 30 69, 39 62 C47 55, 49 43, 50 34Z" fill="#E5989B" opacity="0.11"/>
            <path d="M50 34 C65 17, 92 15, 95 28 C98 40, 82 52, 66 45 C57 41, 52 38, 50 34Z" fill="#E5989B" opacity="0.17"/>
            <path d="M50 34 C61 41, 75 50, 79 60 C81 66, 70 69, 61 62 C53 55, 51 43, 50 34Z" fill="#E5989B" opacity="0.11"/>
            <ellipse cx="50" cy="37" rx="2" ry="7" fill="#E5989B" opacity="0.2"/>
          </svg>
        </div>

        {/* Butterfly 3 — small, bottom-left */}
        <div style={{ position:"absolute", bottom:"22%", left:"3%", animation:"bf-float-a 8s ease-in-out infinite 4s" }}>
          <svg width="26" height="18" viewBox="0 0 100 68" style={{ animation:"bf-flutter 1.9s ease-in-out infinite 1s", display:"block" }}>
            <path d="M50 34 C35 17, 8 15, 5 28 C2 40, 18 52, 34 45 C43 41, 48 38, 50 34Z" fill="#E5989B" opacity="0.14"/>
            <path d="M50 34 C39 41, 25 50, 21 60 C19 66, 30 69, 39 62 C47 55, 49 43, 50 34Z" fill="#E5989B" opacity="0.09"/>
            <path d="M50 34 C65 17, 92 15, 95 28 C98 40, 82 52, 66 45 C57 41, 52 38, 50 34Z" fill="#E5989B" opacity="0.14"/>
            <path d="M50 34 C61 41, 75 50, 79 60 C81 66, 70 69, 61 62 C53 55, 51 43, 50 34Z" fill="#E5989B" opacity="0.09"/>
            <ellipse cx="50" cy="37" rx="2" ry="7" fill="#E5989B" opacity="0.16"/>
          </svg>
        </div>

        {/* Butterfly 4 — tiny, top-right */}
        <div style={{ position:"absolute", top:"28%", right:"7%", animation:"bf-float-b 10s ease-in-out infinite 5s" }}>
          <svg width="20" height="14" viewBox="0 0 100 68" style={{ animation:"bf-flutter 2.1s ease-in-out infinite 0.7s", display:"block" }}>
            <path d="M50 34 C35 17, 8 15, 5 28 C2 40, 18 52, 34 45 C43 41, 48 38, 50 34Z" fill="#F5CAC3" opacity="0.18"/>
            <path d="M50 34 C65 17, 92 15, 95 28 C98 40, 82 52, 66 45 C57 41, 52 38, 50 34Z" fill="#F5CAC3" opacity="0.18"/>
          </svg>
        </div>

        {/* Sparkle dots */}
        {([
          { x:"12%", y:"58%", delay:"0s",   size:3 },
          { x:"88%", y:"22%", delay:"1.1s", size:4 },
          { x:"72%", y:"68%", delay:"2.3s", size:3 },
          { x:"22%", y:"80%", delay:"3.5s", size:2 },
          { x:"93%", y:"50%", delay:"0.7s", size:3 },
          { x:"6%",  y:"35%", delay:"1.8s", size:2 },
          { x:"78%", y:"88%", delay:"2.9s", size:3 },
        ] as { x:string; y:string; delay:string; size:number }[]).map((s, i) => (
          <div key={i} style={{
            position:"absolute", left:s.x, top:s.y,
            width:s.size, height:s.size, borderRadius:"50%",
            background:"#E5989B",
            boxShadow:"0 0 6px 2px rgba(229,152,155,0.5)",
            animation:`sp-twinkle ${2.5 + i * 0.4}s ease-in-out infinite ${s.delay}`,
          }} />
        ))}
      </div>

      {step === 0 ? (
        <div style={{ maxWidth:"540px", margin:"0 auto", padding:"2rem 1.25rem", position:"relative", zIndex:10 }}>
          <Link href="/start" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", color:"#6B7280", fontSize:"0.85rem", marginBottom:"1.5rem", textDecoration:"none" }}>
            ← Back
          </Link>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ background:"rgba(229,152,155,0.04)", border:"1px solid rgba(229,152,155,0.2)", borderRadius:"24px", padding:"2rem", textAlign:"center" }}>
             <div style={{ display:"flex", justifyContent:"center", marginBottom:"1rem" }}>
               <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(229,152,155,0.1)", border:"1px solid rgba(229,152,155,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.75rem" }}>
                 📋
               </div>
             </div>
             <h2 style={{ fontSize:"1.5rem", fontWeight:800, color:"#F5F7FA", marginBottom:"1rem" }}>Medical & Privacy Consent</h2>
             <p style={{ color:"#8B909E", fontSize:"0.9rem", lineHeight:1.6, textAlign:"left", marginBottom:"1.5rem" }}>
               Before we begin, please note that this assessment is not medical advice. By proceeding, you agree that:
               <br/><br/>
               • You will consult a physician if you have serious health conditions.<br/>
               • You consent to Sandy.Lifts processing your data to create your fitness plan.<br/>
               • Your information remains 100% private and secure.
             </p>
             <div style={{ display:"flex", gap:"1rem", alignItems:"flex-start", textAlign:"left", background:"rgba(255,255,255,0.02)", padding:"1.25rem", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.08)", marginBottom:"1.5rem" }}>
                <input type="checkbox" id="w-consent-check" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} style={{ marginTop:"4px", accentColor:"#E5989B", width:"18px", height:"18px" }} />
                <label htmlFor="w-consent-check" style={{ color:"#D8DBFC", fontSize:"0.85rem", lineHeight:1.5, cursor:"pointer" }}>
                  I have read and agree to the Medical Disclaimer & Privacy Terms to proceed with my assessment.
                </label>
             </div>
             <button onClick={() => { if(consentChecked) setStep(1); }} disabled={!consentChecked}
               style={{ width:"100%", padding:"1rem", borderRadius:"14px", fontWeight:700, fontSize:"1rem", cursor:consentChecked?"pointer":"not-allowed", border:"none", background:consentChecked ? "linear-gradient(135deg, #E5989B, #F5CAC3)" : "rgba(255,255,255,0.05)", color:consentChecked?"#07090D":"#6B7280", transition:"all 0.2s" }}>
               Start Assessment →
             </button>
          </motion.div>
        </div>
      ) : (
      <div style={{ maxWidth: submitted ? "840px" : "580px", margin:"0 auto", padding:"0 1rem", position:"relative", zIndex:10, transition: "max-width 0.5s ease-in-out" }}>
        <Link href="/start" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", color:"#6B7280", fontSize:"0.85rem", marginBottom:"1.5rem", textDecoration:"none" }}>
          ← Back
        </Link>

        <div style={{ textAlign:"center", marginBottom:"2rem" }}>

          {/* Coach Reviewed badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:"999px", padding:"0.3rem 0.9rem", fontSize:"0.7rem", fontWeight:700, color:"#4ADE80", marginBottom:"1rem", letterSpacing:"0.04em" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E", display:"inline-block", boxShadow:"0 0 6px rgba(34,197,94,0.9)", animation:"fpulse 2s ease-in-out infinite" }} />
            Coach Reviewed Application
          </div>

          <h1 style={{ fontSize:"clamp(1.6rem,4.5vw,2.2rem)", fontWeight:900, color:"#F5F7FA", margin:"0 0 0.5rem", lineHeight:1.15 }}>
            Tell Us About{" "}
            <span style={{ background:`linear-gradient(135deg,${P},#E8D0CE)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Yourself
            </span>
          </h1>

          <p style={{ fontSize:"0.88rem", fontStyle:"italic", color:"#6B7280", margin:"0 0 1rem" }}>
            &ldquo;Every plan is customized — not copied.&rdquo;
          </p>

          {/* Trust pills */}
          <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"0.5rem" }}>
            {["⏱ 5 min assessment", "🔒 Private & secure", "✅ Coach reviewed"].map(t => (
              <span key={t} style={{ fontSize:"0.7rem", fontWeight:600, color:"#6B7280", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"999px", padding:"3px 12px" }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:"1.75rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:"0.75rem", color:"#6B7280", marginBottom:"0.75rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px",
              background: "rgba(229,152,155,0.12)",
              border: "1px solid rgba(229,152,155,0.3)",
              boxShadow: "0 0 12px rgba(229,152,155,0.2)"
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E5989B", boxShadow: "0 0 6px #E5989B", animation: "fpulse 2s infinite" }} />
              <span style={{ color: "#E5989B", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {STEPS[step-1].icon} Step {step}: {STEPS[step-1].title}
              </span>
            </div>
            <span style={{ fontWeight: 600 }}>{step} of 7</span>
          </div>
          <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"3px", overflow:"hidden" }}>
            <motion.div animate={{ width:`${progress}%` }} transition={{ duration:0.4, ease:"easeInOut" }}
              style={{ height:"100%", borderRadius:"3px", background:`linear-gradient(90deg, ${P}, #E8D0CE)` }} />
          </div>
        </div>

        <motion.div key={step} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, ease:"easeOut" }}
          style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"20px", padding:"1.75rem", position: "relative", overflow: "hidden" }}>
          <p style={{ color:"#8B909E", fontSize:"0.82rem", marginBottom:"1.25rem" }}>{STEPS[step-1].sub}</p>
          {renderStep()}

          {/* Glassmorphic Overlay Progress Loader */}
          {analyzing && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(7, 9, 13, 0.94)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              zIndex: 50,
              borderRadius: "20px"
            }}>
              {/* Sweeping Laser Line */}
              <div style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, transparent, ${P}, transparent)`,
                boxShadow: `0 0 12px ${P}`,
                animation: "scan-laser 2.2s ease-in-out infinite",
                pointerEvents: "none"
              }} />

              {/* Loader Animation */}
              <div style={{ width: "100%", maxWidth: "320px", textAlign: "center", position: "relative", zIndex: 10 }}>
                
                {/* 3D Radar Circle Ripple Indicator */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: `2px dashed rgba(229, 152, 155, 0.3)`,
                    borderTopColor: P,
                    position: "relative",
                    animation: "spin 2.2s linear infinite",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {/* Inner glowing core */}
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: `radial-gradient(circle, rgba(229, 152, 155, 0.2) 0%, transparent 70%)`,
                      border: `1px solid rgba(229, 152, 155, 0.2)`,
                      animation: "fpulse 1.4s ease-in-out infinite"
                    }} />
                    <span style={{ fontSize: "1.75rem", position: "absolute", animation: "fpulse 2s ease-in-out infinite" }}>🧬</span>
                  </div>
                </div>

                {/* Progress Percentage */}
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
                  {analyzeProgress}%
                </div>
                
                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.15em", color: PL, fontWeight: 800, marginBottom: "1.25rem" }}>
                  System Scan In Progress
                </div>

                {/* Progress Bar Container */}
                <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden", marginBottom: "1.25rem", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{
                    width: `${analyzeProgress}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${P}, #F5CAC3)`,
                    boxShadow: `0 0 10px ${P}`,
                    borderRadius: "999px",
                    transition: "width 0.1s linear"
                  }} />
                </div>

                {/* Dynamic Ticker Text */}
                <div style={{ fontSize: "0.82rem", color: "#AAB3C5", minHeight: "36px", transition: "all 0.2s", padding: "0 0.5rem" }}>
                  {analyzeProgress < 20 && "🧬 Analyzing physical parameters & skeletal composition..."}
                  {analyzeProgress >= 20 && analyzeProgress < 40 && "⚖️ Computing custom Basal Metabolic Rate (BMR)..."}
                  {analyzeProgress >= 40 && analyzeProgress < 60 && "🥑 Formulating calorie and macronutrient split ratios..."}
                  {analyzeProgress >= 60 && analyzeProgress < 80 && "🏋️ Matching exercise roadmaps to weekly routine..."}
                  {analyzeProgress >= 80 && "📡 Transmitting assessment securely to Sandy's Coaching Desk..."}
                </div>
              </div>

              <style>{`
                @keyframes scan-laser {
                  0% { top: 0%; opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { top: 100%; opacity: 0; }
                }
              `}</style>
            </div>
          )}
        </motion.div>

        {step < 7 && (
          <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.25rem" }}>
            {step > 1 && (
              <button type="button" onClick={back}
                style={{ flex:1, padding:"0.875rem", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", color:"#8B909E", fontSize:"0.9rem", fontWeight:500, cursor:"pointer", transition:"all 0.18s" }}>
                ← Back
              </button>
            )}
            {/* 3D Live CTA */}
            <button type="button" onClick={next} className="wcta-btn"
              style={{
                flex:2, padding:"0.95rem 1.25rem", borderRadius:"14px",
                fontWeight:800, fontSize:"0.95rem", cursor:"pointer",
                border:"none", position:"relative", overflow:"hidden",
                background:"linear-gradient(135deg, #FF8FA3 0%, #E5989B 45%, #FFADB8 100%)",
                color:"#fff", letterSpacing:"0.04em",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
              }}>
              {/* Shimmer sweep */}
              <span style={{ position:"absolute", inset:0, background:"linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)", animation:"wcta-shine 2.8s ease-in-out infinite", pointerEvents:"none" }} />
              {/* Pulsing ring */}
              <span style={{ position:"absolute", inset:-1, borderRadius:"15px", border:"1.5px solid rgba(255,182,193,0.7)", animation:"wcta-ring 2.8s ease-in-out infinite", pointerEvents:"none" }} />
              {/* Top gloss */}
              <span style={{ position:"absolute", top:0, left:0, right:0, height:"45%", borderRadius:"14px 14px 50% 50%", background:"linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)", pointerEvents:"none" }} />
              <span style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                {step === 6 ? "Review My Answers" : "Continue"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
