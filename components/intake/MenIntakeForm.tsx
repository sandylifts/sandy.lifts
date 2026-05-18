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
  comments: string;
}

const INIT: MenForm = {
  name:"", age:"", height:"", weight:"", bodyType:"",
  healthConditions:[], jointIssues:[], smokingAlcohol:"", medicines:"",
  trainedBefore:"", whyStopped:"", previousActivity:[], currentActivityLevel:"",
  jobType:"", workHours:"", outsideFood:"",
  foodType:"", mealsPerDay:"", foodDislikes:"", junkHabit:"", supplements:[],
  primaryGoal:"", secondaryGoal:[], targetInMonth:"", sportTarget:"", whyTransform:"",
  comments:"",
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
  const [step, setStep] = useState(1);
  const [fd, setFd] = useState<MenForm>(INIT);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    setSubmitting(true);
    
    // Fire and forget API call so it doesn't block WhatsApp redirect if network/Supabase is slow
    fetch("/api/intake", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ gender:"men", formData: fd }),
    }).catch(() => {});

    const msg = encodeURIComponent(`Hi Sandy! 💪 I just filled my men's fitness assessment form on your website.\n\nName: ${fd.name}\nAge: ${fd.age} yrs\nGoal: ${fd.primaryGoal}\nHealth: ${fd.healthConditions.join(", ")||"None"}\n\nPlease review my details and create my personalised plan 🙏\n\nI'll explore the website again to see the rest of your amazing tools! Thank you so much! ✨`);
    window.open(`https://wa.me/918968244407?text=${msg}`, "_blank");
    
    setSubmitted(true);
    setSubmitting(false);
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

          {submitted ? (
            <div style={{ animation:"fade-in 0.5s ease-out" }}>
              {/* Success Banner */}
              <div style={{ background:`linear-gradient(135deg, rgba(77,163,255,0.12), rgba(77,163,255,0.04))`, border:`1px solid rgba(77,163,255,0.25)`, borderRadius:"20px", padding:"1.75rem", textAlign:"center", marginBottom:"1.25rem", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:"-50px", left:"50%", transform:"translateX(-50%)", width:"150px", height:"150px", borderRadius:"50%", background:"radial-gradient(circle, rgba(77,163,255,0.2) 0%, transparent 70%)", pointerEvents:"none" }} />
                
                <div style={{ fontSize:"2.5rem", marginBottom:"0.5rem", position:"relative", zIndex:1 }}>🎉</div>
                <p style={{ background:`linear-gradient(135deg,#4DA3FF,#C3FCFE)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:900, fontSize:"1.3rem", marginBottom:"0.4rem", position:"relative", zIndex:1 }}>
                  You&apos;re officially in the 1%!
                </p>
                <p style={{ color:"#8B909E", fontSize:"0.9rem", marginBottom:"1.25rem", lineHeight:1.5, position:"relative", zIndex:1 }}>
                  Your form is with me! 🚀 WhatsApp opened — please hit <strong>Send</strong> to notify me.
                </p>

                {/* Note from Sandy */}
                <div style={{ background:"rgba(77,163,255,0.06)", border:"1px dashed rgba(77,163,255,0.3)", borderRadius:"12px", padding:"0.85rem", marginBottom:"1.25rem", textAlign:"left", position:"relative", zIndex:1 }}>
                  <p style={{ margin:0, fontSize:"0.8rem", color:"#4DA3FF", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"0.25rem" }}>💬 Note from Sandy:</p>
                  <p style={{ margin:0, fontSize:"0.85rem", color:"#D8DBFC", fontStyle:"italic", lineHeight:1.45 }}>
                    &ldquo;Thank you so much! Please explore my other tools (like the AI Coach, Macro Calculator, and quizzes) while I review your assessment—there is so much waiting for you!&rdquo;
                  </p>
                </div>

                {/* What Happens Next - Compact */}
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"14px", padding:"1rem", textAlign:"left", border:"1px solid rgba(255,255,255,0.05)", position:"relative", zIndex:1 }}>
                  <p style={{ fontSize:"0.68rem", fontWeight:800, color:CL, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"0.6rem" }}>Next Steps</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                    <p style={{ fontSize:"0.82rem", color:"#D8DBFC", margin:0, display:"flex", alignItems:"center", gap:"0.5rem" }}><span style={{fontSize:"1rem"}}>1️⃣</span> Sandy reviews your profile</p>
                    <p style={{ fontSize:"0.82rem", color:"#D8DBFC", margin:0, display:"flex", alignItems:"center", gap:"0.5rem" }}><span style={{fontSize:"1rem"}}>2️⃣</span> A personalised plan is created</p>
                    <p style={{ fontSize:"0.82rem", color:"#D8DBFC", margin:0, display:"flex", alignItems:"center", gap:"0.5rem" }}><span style={{fontSize:"1rem"}}>3️⃣</span> Sandy reaches out in 24 hours</p>
                  </div>
                </div>
              </div>

              {/* AI Coach Mini Banner */}
              <div style={{ marginBottom:"1.25rem" }}>
                <p style={{ fontSize:"0.75rem", fontWeight:700, color:"#8B909E", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.6rem", textAlign:"center" }}>While You Wait</p>
                <Link href="/ai-coach" style={{ textDecoration:"none" }}>
                  <div style={{ background:"linear-gradient(145deg, rgba(167,139,250,0.1), rgba(167,139,250,0.02))", border:"1px solid rgba(167,139,250,0.25)", borderRadius:"16px", padding:"1rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", transition:"all 0.2s", cursor:"pointer", boxShadow:"0 4px 20px rgba(167,139,250,0.1)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                      <div style={{ width:40, height:40, borderRadius:"12px", background:"rgba(167,139,250,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", border:"1px solid rgba(167,139,250,0.4)" }}>🤖</div>
                      <div>
                        <p style={{ margin:0, color:"#fff", fontWeight:800, fontSize:"0.9rem" }}>Ask Sandy&apos;s AI Coach</p>
                        <p style={{ margin:0, color:"#A78BFA", fontSize:"0.75rem", fontWeight:500 }}>Get instant answers now ⚡</p>
                      </div>
                    </div>
                    <div style={{ color:"#A78BFA" }}>→</div>
                  </div>
                </Link>
              </div>

              {/* Tools Grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:"1.5rem" }}>
                <Link href="/tools/macro-calculator" style={{ textDecoration:"none", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"0.85rem", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.4rem", textAlign:"center", transition:"background 0.2s" }}>
                  <span style={{ fontSize:"1.25rem" }}>🧮</span>
                  <span style={{ color:"#C4C4CC", fontSize:"0.75rem", fontWeight:600 }}>Macro Calc</span>
                </Link>
                <Link href="/tools/body-type-quiz" style={{ textDecoration:"none", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"0.85rem", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.4rem", textAlign:"center", transition:"background 0.2s" }}>
                  <span style={{ fontSize:"1.25rem" }}>🧬</span>
                  <span style={{ color:"#C4C4CC", fontSize:"0.75rem", fontWeight:600 }}>Body Type Quiz</span>
                </Link>
              </div>

              <Link href="/" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem", background:`rgba(255,255,255,0.05)`, color:"#8B909E", fontWeight:600, fontSize:"0.85rem", padding:"0.85rem", borderRadius:"12px", textDecoration:"none", border:"1px solid rgba(255,255,255,0.1)" }}>
                ← Return to Home
              </Link>
              <style>{`@keyframes fade-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
            </div>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              style={{ width:"100%", padding:"1rem", borderRadius:"14px", fontWeight:700, fontSize:"1rem",
                cursor:submitting ? "wait" : "pointer", border:"none",
                background:"linear-gradient(135deg, #4DA3FF, #C3FCFE)",
                color:"#07090D", boxShadow:"0 0 30px rgba(77,163,255,0.4)", opacity:submitting ? 0.7 : 1,
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem" }}>
              {submitting ? (
                <><span style={{ display:"inline-block", width:"16px", height:"16px", border:"2px solid rgba(0,0,0,0.2)", borderTopColor:"#07090D", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />Submitting...</>
              ) : "Submit & Notify Sandy 💪"}
            </button>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

      <div style={{ maxWidth:"580px", margin:"0 auto", padding:"0 1rem", position:"relative", zIndex:1 }}>
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
          style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"20px", padding:"1.75rem" }}>
          <p style={{ color:"#6B7280", fontSize:"0.82rem", marginBottom:"1.25rem" }}>{STEPS[step-1].sub}</p>
          {renderStep()}
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
    </div>
  );
}
