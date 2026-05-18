"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const W_PTS = ["PCOS / PCOD aware planning","Period-friendly schedule","Hormonal balance nutrition","Fat loss & body toning","Focus: Belly, Thighs, Arms","Veg-friendly meal plan"];
const M_PTS = ["Fat loss & muscle building","Exercise history review","Body recomposition plans","Strength & stamina goals","Diet & supplement guidance","Performance nutrition"];
const TRUST = [{ icon:"🔒", label:"100% Private" },{ icon:"✅", label:"No Login" },{ icon:"⏱", label:"5 mins" },{ icon:"📋", label:"Plan in 24 hrs" }];

const Check = ({ color }: { color: string }) => (
  <span style={{ width:18,height:18,borderRadius:"50%",background:`rgba(${color},0.15)`,border:`1px solid rgba(${color},0.4)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke={`rgb(${color})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </span>
);

export function GenderSelect() {
  return (
    <div style={{ minHeight:"100vh",background:"#07090D",paddingTop:"90px",paddingBottom:"60px",overflow:"hidden",position:"relative" }}>
      <div style={{ position:"absolute",top:"-80px",left:"10%",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(229,152,155,0.07) 0%,transparent 70%)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:"-80px",right:"10%",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(77,163,255,0.07) 0%,transparent 70%)",pointerEvents:"none" }} />

      <div style={{ maxWidth:"860px",margin:"0 auto",padding:"0 1.25rem",position:"relative" }}>

        {/* Header */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }} style={{ textAlign:"center",marginBottom:"2.75rem" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"999px",padding:"0.4rem 1.25rem",fontSize:"0.8rem",color:"#8B909E",marginBottom:"1.25rem" }}>
            🌟 Free Assessment — No login required
          </div>
          <h1 style={{ fontSize:"clamp(1.75rem,5vw,2.75rem)",fontWeight:900,color:"#F5F7FA",margin:"0 0 0.75rem",lineHeight:1.15 }}>
            Get Your Free{" "}
            <span style={{ background:"linear-gradient(90deg,#E5989B,#4DA3FF)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Personalised Plan</span>
          </h1>
          <p style={{ color:"#8B909E",fontSize:"1rem",maxWidth:"460px",margin:"0 auto",lineHeight:1.65 }}>
            Fill a quick 5-min assessment. Sandy personally reviews it and builds a plan made just for your body and goals.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.25rem",marginBottom:"2.5rem" }}>

          {/* Women */}
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.55,delay:0.1 }}
            style={{ background:"rgba(229,152,155,0.04)",border:"1px solid rgba(229,152,155,0.25)",borderRadius:"22px",padding:"2rem",display:"flex",flexDirection:"column",gap:"1.25rem",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:"-50px",left:"50%",transform:"translateX(-50%)",width:"180px",height:"180px",borderRadius:"50%",background:"radial-gradient(circle,rgba(229,152,155,0.2) 0%,transparent 70%)",pointerEvents:"none" }} />
            <div style={{ position:"relative" }}>
              {/* Coach reviewed badge */}
              <div style={{ display:"inline-flex",alignItems:"center",gap:"0.45rem",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:"999px",padding:"0.25rem 0.75rem",fontSize:"0.7rem",fontWeight:700,color:"#4ADE80",marginBottom:"0.85rem",letterSpacing:"0.04em" }}>
                <span style={{ width:"7px",height:"7px",borderRadius:"50%",background:"#22C55E",display:"inline-block",boxShadow:"0 0 6px rgba(34,197,94,0.9)",animation:"pulse-green 2s ease-in-out infinite" }} />
                Coach Reviewed Application
              </div>
              <style>{`@keyframes pulse-green { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.25)} }`}</style>
              <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.6rem" }}>
                <span style={{ fontSize:"1.75rem" }}>💖</span>
                <div>
                  <p style={{ margin:0,fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase" as const,color:"#E5989B" }}>For Women</p>
                  <h2 style={{ margin:0,fontSize:"1.2rem",fontWeight:800,color:"#F5F7FA",lineHeight:1.2 }}>Let&apos;s Understand Your Body First</h2>
                </div>
              </div>
              <p style={{ color:"#F5CAC3",fontSize:"0.83rem",margin:"0 0 0.35rem",lineHeight:1.65,fontWeight:600 }}>Your body needs understanding — not punishment.</p>
              <p style={{ color:"#8B909E",fontSize:"0.8rem",margin:0,lineHeight:1.7 }}>Supportive fat loss coaching designed for women dealing with PCOS, bloating, cravings, hormonal imbalances &amp; stubborn weight. Custom fitness and nutrition strategies tailored to your body, lifestyle, routine &amp; transformation goals.</p>
            </div>
            <ul style={{ listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"0.6rem" }}>
              {W_PTS.map(pt=>(
                <li key={pt} style={{ display:"flex",alignItems:"center",gap:"0.6rem",fontSize:"0.875rem",color:"#D8DBFC" }}>
                  <Check color="229,152,155" />{pt}
                </li>
              ))}
            </ul>
            <Link href="/start/women" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.9rem 1.5rem",borderRadius:"14px",fontWeight:700,fontSize:"0.95rem",textDecoration:"none",background:"linear-gradient(135deg,#E5989B,#F5CAC3)",color:"#fff",boxShadow:"0 0 28px rgba(229,152,155,0.35)" }}>
              Get My Women&apos;s Plan →
            </Link>
          </motion.div>

          {/* Men */}
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.55,delay:0.2 }}
            style={{ background:"rgba(77,163,255,0.04)",border:"1px solid rgba(77,163,255,0.2)",borderRadius:"22px",padding:"2rem",display:"flex",flexDirection:"column",gap:"1.25rem",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:"-50px",left:"50%",transform:"translateX(-50%)",width:"180px",height:"180px",borderRadius:"50%",background:"radial-gradient(circle,rgba(77,163,255,0.18) 0%,transparent 70%)",pointerEvents:"none" }} />
            <div style={{ position:"relative" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.5rem" }}>
                <span style={{ fontSize:"1.75rem" }}>💪</span>
                <div>
                  <p style={{ margin:0,fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase" as const,color:"#4DA3FF" }}>For Men</p>
                  <h2 style={{ margin:0,fontSize:"1.3rem",fontWeight:800,color:"#F5F7FA" }}>Men&apos;s Programme</h2>
                </div>
              </div>
              <p style={{ color:"#8B909E",fontSize:"0.85rem",margin:0,lineHeight:1.6 }}>Built for male physiology — muscle, fat loss, recomposition and strength.</p>
            </div>
            <ul style={{ listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"0.6rem" }}>
              {M_PTS.map(pt=>(
                <li key={pt} style={{ display:"flex",alignItems:"center",gap:"0.6rem",fontSize:"0.875rem",color:"#D8DBFC" }}>
                  <Check color="77,163,255" />{pt}
                </li>
              ))}
            </ul>
            <Link href="/start/men" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.9rem 1.5rem",borderRadius:"14px",fontWeight:700,fontSize:"0.95rem",textDecoration:"none",background:"linear-gradient(135deg,#4DA3FF,#66E6FF)",color:"#07090D",boxShadow:"0 0 28px rgba(77,163,255,0.35)" }}>
              Get My Men&apos;s Plan →
            </Link>
          </motion.div>
        </div>

        {/* Trust badges */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5,delay:0.4 }}
          style={{ display:"flex",flexWrap:"wrap" as const,justifyContent:"center",gap:"0.75rem" }}>
          {TRUST.map(t=>(
            <div key={t.label} style={{ display:"flex",alignItems:"center",gap:"0.4rem",padding:"0.4rem 1rem",borderRadius:"999px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",fontSize:"0.8rem",color:"#8B909E" }}>
              <span>{t.icon}</span>{t.label}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
