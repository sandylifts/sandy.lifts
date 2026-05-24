"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface MenForm {
  name: string; age: string; height: string; weight: string; bodyType: string;
  healthConditions: string[]; jointIssues: string[]; smokingAlcohol: string; medicines: string;
  trainedBefore: string; whyStopped: string; previousActivity: string[]; currentActivityLevel: string;
  jobType: string; workHours: string; outsideFood: string;
  foodType: string; mealsPerDay: string; foodDislikes: string; junkHabit: string; supplements: string[];
  primaryGoal: string; secondaryGoal: string[]; targetInMonth: string; sportTarget: string; whyTransform: string;
  comments: string; referredBy: string; referrerName: string;
}

const INIT: MenForm = {
  name:"", age:"", height:"", weight:"", bodyType:"",
  healthConditions:[], jointIssues:[], smokingAlcohol:"", medicines:"",
  trainedBefore:"", whyStopped:"", previousActivity:[], currentActivityLevel:"",
  jobType:"", workHours:"", outsideFood:"",
  foodType:"", mealsPerDay:"", foodDislikes:"", junkHabit:"", supplements:[],
  primaryGoal:"", secondaryGoal:[], targetInMonth:"", sportTarget:"", whyTransform:"",
  comments:"", referredBy:"", referrerName:"",
};

const STEPS = [
  { title:"Basic Info",         icon:"👤", sub:"Let's start with the basics" },
  { title:"Health",             icon:"❤️", sub:"Your health history helps us keep you safe" },
  { title:"Exercise History",   icon:"🏋️", sub:"Tell us about your past training" },
  { title:"Daily Routine",      icon:"💼", sub:"Your job and daily lifestyle" },
  { title:"Diet & Nutrition",   icon:"🥗", sub:"What does your eating look like?" },
  { title:"Your Goal",          icon:"🎯", sub:"What do you want to achieve?" },
  { title:"Review & Submit",    icon:"✅", sub:"Check your answers and send!" },
];

const C   = "#4DA3FF";
const CL  = "#93C5FD";
const CBG = "rgba(255,255,255,0.07)";
const CBD = "rgba(255,255,255,0.18)";

// ── Module-level atoms (MUST be outside component to avoid remount on re-render) ──

function MLabel({ t }: { t: string }) {
  return <p style={{ fontSize:"0.82rem", fontWeight:600, color:"#A0A8B4", marginBottom:"0.45rem", margin:"0 0 0.45rem 0" }}>{t}</p>;
}

function MGrid({ children, cols=2 }: { children: React.ReactNode; cols?: number }) {
  return <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:"0.5rem" }}>{children}</div>;
}

function MErrMsg({ err }: { err?: string }) {
  return err ? <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.4rem" }}>{err}</p> : null;
}

function MBtn({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      style={{ padding:"0.55rem 0.9rem", borderRadius:"10px", fontSize:"0.85rem",
        fontWeight: selected ? 600 : 400, cursor:"pointer", textAlign:"left",
        background: selected ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.025)",
        border:`1px solid ${selected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
        color: selected ? "#F5F7FA" : "#6B7280",
        boxShadow: selected ? "0 0 12px rgba(77,163,255,0.18)" : "none",
        transition:"all 0.18s ease" }}>
      {selected && <span style={{ color:C, marginRight:"0.35rem" }}>✓</span>}{label}
    </button>
  );
}

function MTextInput({ value, error, placeholder, type="text", onChange }: {
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

function MTextarea({ value, placeholder, onChange }: {
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
export function MenIntakeForm() {
  const [step, setStep] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);
  const [fd, setFd] = useState<MenForm>(INIT);
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
    const s = localStorage.getItem("intake_step_men");
    if (s) setStep(parseInt(s, 10));
  }, []);

  useEffect(() => {
    if (submitted) {
      localStorage.removeItem("intake_step_men");
    } else {
      localStorage.setItem("intake_step_men", step.toString());
    }
  }, [step, submitted]);

  const set = (f: keyof MenForm, v: string) => {
    setFd(p => ({ ...p, [f]: v }));
    setErrs(p => ({ ...p, [f]: "" }));
  };
  const toggle = (f: keyof MenForm, v: string) =>
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
      if (!fd.jointIssues.length) e.jointIssues = "Select at least one";
      if (!fd.smokingAlcohol) e.smokingAlcohol = "Please select";
    }
    if (step === 3) {
      if (!fd.trainedBefore) e.trainedBefore = "Please select";
      if (!fd.currentActivityLevel) e.currentActivityLevel = "Please select";
    }
    if (step === 4) {
      if (!fd.jobType) e.jobType = "Please select";
      if (!fd.workHours) e.workHours = "Please select";
      if (!fd.outsideFood) e.outsideFood = "Please select";
    }
    if (step === 5) {
      if (!fd.foodType) e.foodType = "Please select";
      if (!fd.mealsPerDay) e.mealsPerDay = "Please select";
      if (!fd.junkHabit) e.junkHabit = "Please select";
    }
    if (step === 6) {
      if (!fd.primaryGoal) e.primaryGoal = "Please select your goal";
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
      body: JSON.stringify({ gender:"men", formData: fd }),
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
        border:`1px solid ${active ? CBD : "rgba(255,255,255,0.1)"}`,
        background: active ? CBG : "transparent",
        color: active ? CL : "#6B7280", transition:"all 0.15s" }}>
      {label}
    </button>
  );

  const renderStep = () => {
    if (step === 1) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <MLabel t="Your Name *" />
          <MTextInput value={fd.name} error={errs.name} placeholder="e.g. Rahul Sharma" onChange={v => set("name", v)} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
          <div>
            <MLabel t="Age *" />
            <MTextInput value={fd.age} error={errs.age} placeholder="e.g. 24" type="number" onChange={v => set("age", v)} />
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.45rem" }}>
              <MLabel t="Weight *" />
              <div style={{ display:"flex", gap:"0.2rem" }}>
                {unitBtn("kg", weightUnit==="kg", () => handleWeightUnitChange("kg"))}
                {unitBtn("lbs", weightUnit==="lbs", () => handleWeightUnitChange("lbs"))}
              </div>
            </div>
            <input type="number" value={fd.weight} placeholder={weightUnit==="kg" ? "e.g. 75" : "e.g. 165"}
              onChange={e => set("weight", e.target.value)}
              style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
                background:"rgba(255,255,255,0.04)", border:`1px solid ${errs.weight ? "#FF4444" : CBD}`,
                color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
            {errs.weight && <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.25rem" }}>{errs.weight}</p>}
          </div>
        </div>
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.45rem" }}>
            <MLabel t="Height *" />
            <div style={{ display:"flex", gap:"0.2rem" }}>
              {unitBtn("cm", heightUnit==="cm", () => handleHeightUnitChange("cm"))}
              {unitBtn("ft/in", heightUnit==="ftin", () => handleHeightUnitChange("ftin"))}
            </div>
          </div>
          {heightUnit === "cm" ? (
            <div>
              <input type="number" value={fd.height} placeholder="e.g. 175"
                onChange={e => set("height", e.target.value)}
                style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
                  background:"rgba(255,255,255,0.04)", border:`1px solid ${errs.height ? "#FF4444" : CBD}`,
                  color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
              {errs.height && <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.25rem" }}>{errs.height}</p>}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              <input type="number" value={heightFt} placeholder="Feet (e.g. 5)"
                onChange={e => { setHeightFt(e.target.value); set("height", `${e.target.value} ft ${heightIn} in`); }}
                style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
                  background:"rgba(255,255,255,0.04)", border:`1px solid ${errs.height ? "#FF4444" : CBD}`,
                  color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
              <input type="number" value={heightIn} placeholder="Inches (e.g. 9)"
                onChange={e => { setHeightIn(e.target.value); set("height", `${heightFt} ft ${e.target.value} in`); }}
                style={{ width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem",
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
                  color:"#F5F7FA", outline:"none", boxSizing:"border-box" }} />
              {errs.height && <p style={{ color:"#FF4444", fontSize:"0.73rem", marginTop:"0.25rem", gridColumn:"1/-1" }}>{errs.height}</p>}
            </div>
          )}
        </div>
        <div>
          <MLabel t="Body Type *" />
          <MGrid>
            <MBtn selected={fd.bodyType==="Skinny"} label="Skinny 🦴" onClick={() => set("bodyType","Skinny")} />
            <MBtn selected={fd.bodyType==="Average"} label="Average" onClick={() => set("bodyType","Average")} />
            <MBtn selected={fd.bodyType==="Overweight"} label="Overweight" onClick={() => set("bodyType","Overweight")} />
            <MBtn selected={fd.bodyType==="Bulky (muscular-fat)"} label="Bulky / Muscular" onClick={() => set("bodyType","Bulky (muscular-fat)")} />
          </MGrid>
          <MErrMsg err={errs.bodyType} />
        </div>
      </div>
    );

    if (step === 2) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <MLabel t="Any health conditions? (select all that apply) *" />
          <MGrid>
            {["High BP","Diabetes","Thyroid","Back pain","Heart condition","None ✓"].map(v => (
              <MBtn key={v} selected={fd.healthConditions.includes(v.replace(" ✓",""))} label={v} onClick={() => toggle("healthConditions", v.replace(" ✓",""))} />
            ))}
          </MGrid>
          <MErrMsg err={errs.healthConditions} />
        </div>
        <div>
          <MLabel t="Any joint / injury issues? *" />
          <MGrid>
            {["Knees","Shoulders","Lower back","Wrists","None ✓"].map(v => (
              <MBtn key={v} selected={fd.jointIssues.includes(v.replace(" ✓",""))} label={v} onClick={() => toggle("jointIssues", v.replace(" ✓",""))} />
            ))}
          </MGrid>
          <MErrMsg err={errs.jointIssues} />
        </div>
        <div>
          <MLabel t="Smoking / Alcohol *" />
          <MGrid>
            {["None ✓","Occasional","Regular smoker","Regular drinker"].map(v => (
              <MBtn key={v} selected={fd.smokingAlcohol===v.replace(" ✓","")} label={v} onClick={() => set("smokingAlcohol", v.replace(" ✓",""))} />
            ))}
          </MGrid>
          <MErrMsg err={errs.smokingAlcohol} />
        </div>
        <div>
          <MLabel t="Current medicines / supplements" />
          <MTextarea value={fd.medicines} placeholder="e.g. BP medication, protein powder, None..." onChange={v => set("medicines", v)} />
        </div>
      </div>
    );

    if (step === 3) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <MLabel t="Have you trained before? *" />
          <MGrid>
            {["Never trained","Tried & left","6+ months 💪","1+ year 🏆","Currently active ✅"].map(v => (
              <MBtn key={v} selected={fd.trainedBefore===v} label={v} onClick={() => set("trainedBefore", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.trainedBefore} />
        </div>
        {fd.trainedBefore === "Tried & left" && (
          <div>
            <MLabel t="Why did you stop?" />
            <MGrid>
              {["Injury","Too busy","No results","Lost motivation"].map(v => (
                <MBtn key={v} selected={fd.whyStopped===v} label={v} onClick={() => set("whyStopped", v)} />
              ))}
            </MGrid>
          </div>
        )}
        <div>
          <MLabel t="What have you done before? (select all)" />
          <MGrid>
            {["Gym 🏋️","Home workout","Running 🏃","Sports ⚽","Nothing"].map(v => (
              <MBtn key={v} selected={fd.previousActivity.includes(v)} label={v} onClick={() => toggle("previousActivity", v)} />
            ))}
          </MGrid>
        </div>
        <div>
          <MLabel t="Current activity level *" />
          <MGrid>
            {["Sedentary (no exercise)","Light (walking)","Moderate","Very active 🔥"].map(v => (
              <MBtn key={v} selected={fd.currentActivityLevel===v} label={v} onClick={() => set("currentActivityLevel", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.currentActivityLevel} />
        </div>
      </div>
    );

    if (step === 4) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <MLabel t="Job / work type *" />
          <MGrid>
            {["Desk / office 💻","Field / active job","Physical labour","Student 📚","Own business"].map(v => (
              <MBtn key={v} selected={fd.jobType===v} label={v} onClick={() => set("jobType", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.jobType} />
        </div>
        <div>
          <MLabel t="Work hours per day *" />
          <MGrid>
            {["Less than 6 hrs","6–8 hrs","8–10 hrs","10+ hrs 😮"].map(v => (
              <MBtn key={v} selected={fd.workHours===v} label={v} onClick={() => set("workHours", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.workHours} />
        </div>
        <div>
          <MLabel t="Outside / canteen food habit *" />
          <MGrid>
            {["Daily 🍱","Sometimes","Rarely","Never (home food)"].map(v => (
              <MBtn key={v} selected={fd.outsideFood===v} label={v} onClick={() => set("outsideFood", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.outsideFood} />
        </div>
      </div>
    );

    if (step === 5) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <MLabel t="Food preference *" />
          <MGrid>
            {["Vegetarian 🥦","Eggetarian 🥚","Non-vegetarian 🍗","Vegan 🌱"].map(v => (
              <MBtn key={v} selected={fd.foodType===v} label={v} onClick={() => set("foodType", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.foodType} />
        </div>
        <div>
          <MLabel t="Meals per day *" />
          <MGrid>
            {["1–2 meals","3 meals","4–5 meals","Irregular"].map(v => (
              <MBtn key={v} selected={fd.mealsPerDay===v} label={v} onClick={() => set("mealsPerDay", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.mealsPerDay} />
        </div>
        <div>
          <MLabel t="Food you dislike / can't eat" />
          <MTextarea value={fd.foodDislikes} placeholder="e.g. Mushrooms, bitter gourd..." onChange={v => set("foodDislikes", v)} />
        </div>
        <div>
          <MLabel t="Junk food habit *" />
          <MGrid>
            {["Daily","Occasionally","Rarely","Clean ✓"].map(v => (
              <MBtn key={v} selected={fd.junkHabit===v} label={v} onClick={() => set("junkHabit", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.junkHabit} />
        </div>
        <div>
          <MLabel t="Current supplements (select all)" />
          <MGrid>
            {["None","Protein powder","Creatine","Multivitamin","Other"].map(v => (
              <MBtn key={v} selected={fd.supplements.includes(v)} label={v} onClick={() => toggle("supplements", v)} />
            ))}
          </MGrid>
        </div>
      </div>
    );

    if (step === 6) return (
      <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
        <div>
          <MLabel t="Primary goal *" />
          <MGrid>
            {["Fat Loss 🔥","Muscle Building 💪","Body Recomposition","Strength 🏋️","Overall Fitness"].map(v => (
              <MBtn key={v} selected={fd.primaryGoal===v} label={v} onClick={() => set("primaryGoal", v)} />
            ))}
          </MGrid>
          <MErrMsg err={errs.primaryGoal} />
        </div>
        <div>
          <MLabel t="Secondary goals (select all)" />
          <MGrid>
            {["Visible Abs","Bigger Arms","Broad Shoulders","Better Stamina","None"].map(v => (
              <MBtn key={v} selected={fd.secondaryGoal.includes(v)} label={v} onClick={() => toggle("secondaryGoal", v)} />
            ))}
          </MGrid>
        </div>
        <div>
          <MLabel t="Target in 1 month" />
          <MTextInput value={fd.targetInMonth} placeholder="e.g. Lose 3 kg, gain visible muscle" onChange={v => set("targetInMonth", v)} />
        </div>
        <div>
          <MLabel t="Any sport / physical target?" />
          <MTextInput value={fd.sportTarget} placeholder="e.g. Cricket match, marathon, none..." onChange={v => set("sportTarget", v)} />
        </div>
        <div>
          <MLabel t="Why do you want to transform?" />
          <MTextarea value={fd.whyTransform} placeholder="Your motivation — helps Sandy build a better plan..." onChange={v => set("whyTransform", v)} />
        </div>
      </div>
    );

    if (step === 7) {
      const Section = ({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) => (
        <div style={{ marginBottom:"0.75rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.45rem 0.75rem", borderRadius:"8px", background:"rgba(195,252,254,0.07)", marginBottom:"0.35rem" }}>
            <span style={{ fontSize:"0.85rem" }}>{emoji}</span>
            <span style={{ fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:CL }}>{title}</span>
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
              <div style={{ background:"rgba(195,252,254,0.03)", border:"1px solid rgba(195,252,254,0.15)", borderRadius:"14px", padding:"0.85rem", overflow:"hidden" }}>
                <Section emoji="👤" title="Personal Profile">
                  <Row icon="🪪" label="Name" value={fd.name} />
                  <Row icon="🎂" label="Age" value={fd.age ? fd.age+" yrs" : ""} />
                  <Row icon="📏" label="Height / Weight" value={`${heightUnit==="cm" ? fd.height+" cm" : fd.height} / ${fd.weight} ${weightUnit}`} />
                  <Row icon="🪞" label="Body Type" value={fd.bodyType} />
                </Section>
                <Section emoji="❤️" title="Health">
                  <Row icon="💊" label="Conditions" value={fd.healthConditions.join(", ")||"None"} />
                  <Row icon="🦵" label="Joint Issues" value={fd.jointIssues.join(", ")||"None"} />
                  <Row icon="🚬" label="Smoking / Alcohol" value={fd.smokingAlcohol} />
                </Section>
                <Section emoji="🏋️" title="Training History">
                  <Row icon="🏅" label="Trained Before" value={fd.trainedBefore} />
                  <Row icon="⚡" label="Activity Level" value={fd.currentActivityLevel} />
                  <Row icon="🎯" label="Previous Activity" value={fd.previousActivity.join(", ")||"None"} />
                </Section>
                <Section emoji="💼" title="Lifestyle & Diet">
                  <Row icon="🖥️" label="Job Type" value={fd.jobType} />
                  <Row icon="⏰" label="Work Hours" value={fd.workHours} />
                  <Row icon="🍱" label="Outside Food" value={fd.outsideFood} />
                  <Row icon="🥗" label="Food Preference" value={fd.foodType} />
                  <Row icon="🍽️" label="Meals / Day" value={fd.mealsPerDay} />
                  <Row icon="🍟" label="Junk Habit" value={fd.junkHabit} />
                  <Row icon="💊" label="Supplements" value={fd.supplements.join(", ")||"None"} />
                </Section>
                <Section emoji="🎯" title="Goals">
                  <Row icon="🔥" label="Primary Goal" value={fd.primaryGoal} />
                  <Row icon="📌" label="Secondary Goals" value={fd.secondaryGoal.join(", ")||"None"} />
                  <Row icon="📅" label="1-Month Target" value={fd.targetInMonth} />
                  <Row icon="🏆" label="Sport Target" value={fd.sportTarget} />
                  <Row icon="💬" label="Motivation" value={fd.whyTransform} />
                </Section>
              </div>

              <div>
                <MLabel t="Anything else Sandy should know?" />
                <MTextarea value={fd.comments} placeholder="Extra details, questions, or special notes..." onChange={v => set("comments", v)} />
              </div>

              <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
                <MLabel t="Who referred you to Sandy.Lifts? *" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  {[
                    { key: "Instagram 📱", label: "Instagram 📱" },
                    { key: "YouTube 🎥", label: "YouTube 🎥" },
                    { key: "Friend / Client 👥", label: "Friend / Client 👥" },
                    { key: "Other 🌟", label: "Other 🌟" }
                  ].map(item => (
                    <MBtn key={item.key} selected={fd.referredBy === item.key} label={item.label} onClick={() => set("referredBy", item.key)} />
                  ))}
                </div>
                <MErrMsg err={errs.referredBy} />

                {/* Conditional Slide-out text field */}
                {(fd.referredBy === "Friend / Client 👥" || fd.referredBy === "Other 🌟") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                    style={{ marginTop: "0.75rem" }}
                  >
                    <MLabel t="What is their name? / Where did you find us? *" />
                    <MTextInput
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
                    background:"linear-gradient(135deg, #4DA3FF, #C3FCFE)",
                    color:"#07090D", boxShadow:"0 0 30px rgba(77,163,255,0.4)", opacity:submitting ? 0.7 : 1,
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
                {["✨", "🎉", "🔥", "💪", "✨", "🏆"].map((char, i) => (
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
                <h2 style={{ background:`linear-gradient(135deg,#4DA3FF,#C3FCFE)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:900, fontSize:"1.8rem", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
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
                        const msg = encodeURIComponent(`Hi Sandy! 💪 I just filled my men's fitness assessment form on your website.\n\nName: ${fd.name}\nAge: ${fd.age} yrs\nGoal: ${fd.primaryGoal}\nHealth: ${fd.healthConditions.join(", ")||"None"}${refStr}\n\nPlease review my details and create my personalised plan 🙏\n\nI'll explore the website again to see the rest of your amazing tools! Thank you so much! ✨`);
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
                  whileHover={{ y: -6, scale: 1.015, border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 20px 40px rgba(255,255,255,0.06)", transition: { duration: 0.2 } }}
                  style={{
                    background: "linear-gradient(145deg, rgba(77,163,255,0.06) 0%, rgba(77,163,255,0.01) 100%)",
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
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, pointerEvents:"none", background:"radial-gradient(ellipse 90% 60% at 50% -5%, rgba(77,163,255,0.18) 0%, transparent 58%)" }} />
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"700px", height:"340px", pointerEvents:"none", background:"radial-gradient(ellipse at bottom, rgba(77,163,255,0.08) 0%, transparent 68%)" }} />

      {/* ── Animated decorative layer ── */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <style>{`
          @keyframes m-orb-drift { 0%,100%{transform:translate(0px,0px)} 50%{transform:translate(-25px,20px)} }
          @keyframes m-spark { 0%{transform:translateY(0px) scale(1);opacity:0} 10%{opacity:0.8} 80%{opacity:0.4} 100%{transform:translateY(-120px) scale(0.3);opacity:0} }
          @keyframes m-bolt-float { 0%,100%{transform:translateY(0px) rotate(-8deg);opacity:0.12} 50%{transform:translateY(-18px) rotate(4deg);opacity:0.22} }
          @keyframes m-dot-twinkle { 0%,100%{opacity:0;transform:scale(0.5)} 40%,60%{opacity:1;transform:scale(1.4)} 50%{opacity:0.6;transform:scale(1)} }
          @keyframes mcta-shine { 0%{transform:translateX(-130%)} 55%,100%{transform:translateX(130%)} }
          @keyframes mcta-glow  { 0%,100%{box-shadow:0 4px 0 rgba(30,80,180,0.45),0 8px 28px rgba(77,163,255,0.5),0 0 55px rgba(77,163,255,0.15)} 50%{box-shadow:0 4px 0 rgba(30,80,180,0.45),0 10px 38px rgba(77,163,255,0.7),0 0 80px rgba(77,163,255,0.28)} }
          @keyframes mcta-ring  { 0%,100%{opacity:0;transform:scale(1)} 40%,60%{opacity:0.7} 50%{opacity:0.3;transform:scale(1.06)} }
          @keyframes fpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
          .mcta-btn { animation: mcta-glow 2.8s ease-in-out infinite; transition: transform 0.12s ease, box-shadow 0.12s ease !important; }
          .mcta-btn:hover { transform: translateY(-3px) !important; }
          .mcta-btn:active { transform: translateY(3px) !important; box-shadow: 0 1px 0 rgba(30,80,180,0.45), 0 4px 14px rgba(77,163,255,0.4) !important; }
        `}</style>

        {/* Drifting orbs */}
        <div style={{ position:"absolute", top:"6%", left:"-6%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(77,163,255,0.07) 0%, transparent 65%)", animation:"m-orb-drift 14s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"8%", right:"-8%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle, rgba(77,163,255,0.05) 0%, transparent 65%)", animation:"m-orb-drift 18s ease-in-out infinite reverse 4s" }} />

        {/* Lightning bolt shapes */}
        {([
          { pos:{ top:"14%", left:"4%" },   size:28, delay:"0s" },
          { pos:{ top:"38%", right:"5%" },  size:20, delay:"2s" },
          { pos:{ bottom:"28%", left:"6%" },size:16, delay:"4s" },
          { pos:{ top:"60%", right:"6%" },  size:14, delay:"1.5s" },
        ] as { pos: React.CSSProperties; size: number; delay: string }[]).map((s, i) => (
          <div key={i} style={{ position:"absolute", ...s.pos, animation:`m-bolt-float ${6+i}s ease-in-out infinite ${s.delay}` }}>
            <svg width={s.size} height={s.size * 1.5} viewBox="0 0 24 36" fill="none">
              <path d="M14 2L4 20h8l-2 14 14-20h-8L14 2z" fill="#4DA3FF" opacity="0.6"/>
            </svg>
          </div>
        ))}

        {/* Rising sparks */}
        {([
          { left:"10%", bottom:"15%", delay:"0s" },
          { left:"85%", bottom:"25%", delay:"0.8s" },
          { left:"25%", bottom:"10%", delay:"1.6s" },
          { left:"70%", bottom:"20%", delay:"2.4s" },
          { left:"50%", bottom:"5%",  delay:"3.2s" },
        ] as { left:string; bottom:string; delay:string }[]).map((s, i) => (
          <div key={i} style={{ position:"absolute", left:s.left, bottom:s.bottom, width:3, height:3, borderRadius:"50%", background:"#4DA3FF", boxShadow:"0 0 6px 2px rgba(77,163,255,0.6)", animation:`m-spark ${3+i*0.5}s ease-out infinite ${s.delay}` }} />
        ))}

        {/* Dot sparkles */}
        {([
          { x:"8%",  y:"55%", delay:"0s",   size:3 },
          { x:"90%", y:"20%", delay:"1.1s", size:4 },
          { x:"75%", y:"65%", delay:"2.3s", size:3 },
          { x:"18%", y:"78%", delay:"3.5s", size:2 },
          { x:"92%", y:"48%", delay:"0.7s", size:3 },
        ] as { x:string; y:string; delay:string; size:number }[]).map((s, i) => (
          <div key={i} style={{ position:"absolute", left:s.x, top:s.y, width:s.size, height:s.size, borderRadius:"50%", background:"#4DA3FF", boxShadow:"0 0 6px 2px rgba(77,163,255,0.5)", animation:`m-dot-twinkle ${2.5+i*0.4}s ease-in-out infinite ${s.delay}` }} />
        ))}
      </div>

      {step === 0 ? (
        <div style={{ maxWidth:"540px", margin:"0 auto", padding:"2rem 1.25rem", position:"relative", zIndex:10 }}>
          <Link href="/start" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", color:"#6B7280", fontSize:"0.85rem", marginBottom:"1.5rem", textDecoration:"none" }}>
            ← Back
          </Link>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ background:"rgba(77,163,255,0.04)", border:"1px solid rgba(77,163,255,0.2)", borderRadius:"24px", padding:"2rem", textAlign:"center" }}>
             <div style={{ display:"flex", justifyContent:"center", marginBottom:"1rem" }}>
               <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(77,163,255,0.1)", border:"1px solid rgba(77,163,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.75rem" }}>
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
                <input type="checkbox" id="m-consent-check" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} style={{ marginTop:"4px", accentColor:"#4DA3FF", width:"18px", height:"18px" }} />
                <label htmlFor="m-consent-check" style={{ color:"#D8DBFC", fontSize:"0.85rem", lineHeight:1.5, cursor:"pointer" }}>
                  I have read and agree to the Medical Disclaimer & Privacy Terms to proceed with my assessment.
                </label>
             </div>
             <button onClick={() => { if(consentChecked) setStep(1); }} disabled={!consentChecked}
               style={{ width:"100%", padding:"1rem", borderRadius:"14px", fontWeight:700, fontSize:"1rem", cursor:consentChecked?"pointer":"not-allowed", border:"none", background:consentChecked ? "linear-gradient(135deg, #4DA3FF, #66E6FF)" : "rgba(255,255,255,0.05)", color:consentChecked?"#07090D":"#6B7280", transition:"all 0.2s" }}>
               Start Assessment →
             </button>
          </motion.div>
        </div>
      ) : (
      <div style={{ maxWidth: submitted ? "840px" : "580px", margin:"0 auto", padding:"0 1rem", position:"relative", zIndex:1, transition: "max-width 0.5s ease-in-out" }}>
        <Link href="/start" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", color:"#6B7280", fontSize:"0.85rem", marginBottom:"1.5rem", textDecoration:"none" }}>
          ← Back
        </Link>

        {/* ── Header ── */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>

          {/* Coach Reviewed badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:"999px", padding:"0.3rem 0.9rem", fontSize:"0.7rem", fontWeight:700, color:"#4ADE80", marginBottom:"1rem", letterSpacing:"0.04em" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E", display:"inline-block", boxShadow:"0 0 6px rgba(34,197,94,0.9)", animation:"fpulse 2s ease-in-out infinite" }} />
            Coach Reviewed Transformation Plan
          </div>

          <h1 style={{ fontSize:"clamp(1.6rem,4.5vw,2.2rem)", fontWeight:900, color:"#F5F7FA", margin:"0 0 0.5rem", lineHeight:1.15 }}>
            Tell Us About{" "}
            <span style={{ background:"linear-gradient(135deg,#4DA3FF,#93C5FD)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
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

        {/* ── Progress ── */}
        <div style={{ marginBottom:"1.75rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:"0.75rem", color:"#6B7280", marginBottom:"0.6rem" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"4px 12px", borderRadius:"999px", background:"rgba(77,163,255,0.1)", border:"1px solid rgba(77,163,255,0.25)", boxShadow:"0 0 10px rgba(77,163,255,0.18)" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:C, boxShadow:`0 0 6px ${C}`, animation:"fpulse 2s infinite" }} />
              <span style={{ color:C, fontWeight:700, fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                {STEPS[step-1].icon} Step {step}: {STEPS[step-1].title}
              </span>
            </div>
            <span style={{ fontWeight:600 }}>{step} of 7</span>
          </div>
          <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"3px", overflow:"hidden" }}>
            <motion.div animate={{ width:`${progress}%` }} transition={{ duration:0.4, ease:"easeInOut" }}
              style={{ height:"100%", borderRadius:"3px", background:"linear-gradient(90deg, #4DA3FF, #93C5FD)" }} />
          </div>
        </div>

        {/* ── Step card ── */}
        <motion.div key={step} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, ease:"easeOut" }}
          style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"20px", padding:"1.75rem", position: "relative", overflow: "hidden" }}>
          <p style={{ color:"#6B7280", fontSize:"0.82rem", marginBottom:"1.25rem" }}>{STEPS[step-1].sub}</p>
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
                background: `linear-gradient(90deg, transparent, ${C}, transparent)`,
                boxShadow: `0 0 12px ${C}`,
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
                    border: `2px dashed rgba(77, 163, 255, 0.3)`,
                    borderTopColor: C,
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
                      background: `radial-gradient(circle, rgba(77,163,255,0.2) 0%, transparent 70%)`,
                      border: `1px solid rgba(77,163,255,0.2)`,
                      animation: "fpulse 1.4s ease-in-out infinite"
                    }} />
                    <span style={{ fontSize: "1.75rem", position: "absolute", animation: "fpulse 2s ease-in-out infinite" }}>🧬</span>
                  </div>
                </div>

                {/* Progress Percentage */}
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
                  {analyzeProgress}%
                </div>
                
                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.15em", color: CL, fontWeight: 800, marginBottom: "1.25rem" }}>
                  System Scan In Progress
                </div>

                {/* Progress Bar Container */}
                <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden", marginBottom: "1.25rem", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{
                    width: `${analyzeProgress}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${C}, #C3FCFE)`,
                    boxShadow: `0 0 10px ${C}`,
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

        {/* ── Nav buttons ── */}
        {step < 7 && (
          <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.25rem" }}>
            {step > 1 && (
              <button type="button" onClick={back}
                style={{ flex:1, padding:"0.875rem", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", color:"#8B909E", fontSize:"0.9rem", fontWeight:500, cursor:"pointer", transition:"all 0.18s" }}>
                ← Back
              </button>
            )}
            <button type="button" onClick={next} className="mcta-btn"
              style={{
                flex:2, padding:"0.95rem 1.25rem", borderRadius:"14px",
                fontWeight:800, fontSize:"0.95rem", cursor:"pointer",
                border:"none", position:"relative", overflow:"hidden",
                background:"linear-gradient(135deg, #3B82F6 0%, #4DA3FF 45%, #93C5FD 100%)",
                color:"#fff", letterSpacing:"0.04em",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
              }}>
              <span style={{ position:"absolute", inset:0, background:"linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)", animation:"mcta-shine 2.8s ease-in-out infinite", pointerEvents:"none" }} />
              <span style={{ position:"absolute", inset:-1, borderRadius:"15px", border:"1.5px solid rgba(147,197,253,0.65)", animation:"mcta-ring 2.8s ease-in-out infinite", pointerEvents:"none" }} />
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
