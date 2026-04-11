"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─── Hero slider images ─────────────────────────────────── */
const HERO_SLIDES = [
  { src: "/hero-selfie.png",  alt: "SANDY.LIFTS – Current Physique",    pos: "center 20%" },
  { src: "/hero-before.png", alt: "SANDY.LIFTS – Transformation Journey", pos: "center 30%" },
];

/* ─── Particle Canvas ─────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const colors = ["#4DA3FF", "#66E6FF", "#A78BFA", "#D16BFF"];
    type P = { x: number; y: number; r: number; o: number; dx: number; dy: number; c: string };
    const parts: P[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 90; i++) parts.push({ x: Math.random() * 2000, y: Math.random() * 1000, r: Math.random() * 1.8 + 0.4, o: Math.random() * 0.5 + 0.1, dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25, c: colors[Math.floor(Math.random() * colors.length)] });
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c; ctx.globalAlpha = p.o; ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── Logo Showcase (Right Side) ─────────────────────────── */
function LogoShowcase({ mouseX, mouseY, slideIndex }: { mouseX: number; mouseY: number; slideIndex: number }) {
  const tiltX = (mouseY - 0.5) * -10;
  const tiltY = (mouseX - 0.5) * 10;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "540px",
        aspectRatio: "1 / 1",
        margin: "0 auto",
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: "transform 0.12s ease-out",
      }}
    >
      {/* Background aura connected to logo */}
      <div aria-hidden="true" className="sl-aura-bg" style={{
        position: "absolute", inset: "-15%", borderRadius: "50%",
        background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(77,163,255,0.08) 0%, rgba(167,139,250,0.06) 50%, transparent 75%)",
        filter: "blur(20px)",
      }} />

      {/* Outer rotating dashed ring */}
      <div aria-hidden="true" className="sl-ring-outer" style={{
        position: "absolute", inset: "-4%", borderRadius: "50%",
        border: "1px dashed rgba(77,163,255,0.18)",
      }} />

      {/* Mid glowing ring — pulsing */}
      <div aria-hidden="true" className="sl-ring-pulse" style={{
        position: "absolute", inset: "4%", borderRadius: "50%",
        border: "1.5px solid rgba(77,163,255,0.35)",
        boxShadow: "0 0 30px rgba(77,163,255,0.35), 0 0 80px rgba(77,163,255,0.12), inset 0 0 30px rgba(77,163,255,0.06)",
      }} />

      {/* Inner subtle ring */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: "12%", borderRadius: "50%",
        border: "1px solid rgba(167,139,250,0.15)",
      }} />

      {/* HUD corner marks */}
      {[
        { top: "6%", left: "6%", rot: "0deg" },
        { top: "6%", right: "6%", rot: "90deg" },
        { bottom: "6%", left: "6%", rot: "270deg" },
        { bottom: "6%", right: "6%", rot: "180deg" },
      ].map((pos, i) => (
        <svg key={i} aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none"
          style={{ position: "absolute", ...pos, transform: `rotate(${pos.rot})`, opacity: 0.5 }}>
          <path d="M0 8 L0 0 L8 0" stroke="#4DA3FF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ))}

      {/* — Hero Image Slider — Ken Burns Cross-Fade — */}
      <div className="sl-logo-float" style={{
        position: "absolute",
        inset: "6%",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "inset 0 0 60px rgba(7,9,13,0.9), 0 0 40px rgba(77,163,255,0.2)",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
      }}>
        {/* Gradient overlay: dark bottom for text legibility */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent 50%, rgba(7,9,13,0.55) 100%)",
        }} />
        {/* Scanning light overlay */}
        <div aria-hidden="true" className="sl-scan-light" style={{
          position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
          background: "linear-gradient(180deg, transparent 0%, rgba(77,163,255,0.06) 50%, transparent 100%)",
        }} />
        {/* Neon shimmer overlay */}
        <div aria-hidden="true" className="sl-shimmer-overlay" style={{
          position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
          background: "linear-gradient(135deg, transparent 40%, rgba(77,163,255,0.04) 50%, transparent 60%)",
          backgroundSize: "300% 100%",
        }} />

        {/* Ken Burns cross-fade slides */}
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={i === slideIndex ? "sl-kb-slide sl-kb-active" : "sl-kb-slide"}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 900px) 80vw, 42vw"
              style={{
                objectFit: "cover",
                objectPosition: slide.pos,
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Floating UI Cards ── */}

      {/* Calorie card — bottom left */}
      <div className="sl-card-float" style={{
        position: "absolute", bottom: "4%", left: "-4%",
        background: "rgba(11,14,22,0.88)", border: "1px solid rgba(167,139,250,0.28)",
        borderRadius: "14px", padding: "10px 14px", backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(7,9,13,0.6), 0 0 20px rgba(167,139,250,0.1)",
        minWidth: "130px", zIndex: 5,
      }}>
        <div style={{ fontSize: "8px", color: "#A78BFA", letterSpacing: "0.1em", marginBottom: "4px", fontWeight: 700 }}>CALORIES GOAL</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px" }}>
          <span style={{ fontSize: "22px", fontWeight: 800, color: "#F5F7FA", lineHeight: 1 }}>2,150</span>
          <span style={{ fontSize: "9px", color: "#AAB3C5", marginBottom: "2px" }}>kcal</span>
        </div>
        <div style={{ marginTop: "6px", height: "3px", borderRadius: "2px", background: "rgba(167,139,250,0.15)" }}>
          <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg, #A78BFA, #4DA3FF)", borderRadius: "2px" }} />
        </div>
      </div>

      {/* Progress graph card — top left */}
      <div className="sl-card-float-alt" style={{
        position: "absolute", top: "8%", left: "-6%",
        background: "rgba(11,14,22,0.88)", border: "1px solid rgba(77,163,255,0.25)",
        borderRadius: "14px", padding: "10px 12px", backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(7,9,13,0.6), 0 0 16px rgba(77,163,255,0.1)",
        zIndex: 5,
      }}>
        <div style={{ fontSize: "8px", color: "#66E6FF", letterSpacing: "0.1em", marginBottom: "6px", fontWeight: 700 }}>PROGRESS</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "30px" }}>
          {[35, 52, 45, 68, 58, 80, 72].map((h, i) => (
            <div key={i} style={{
              width: "7px", height: `${h}%`, borderRadius: "2px 2px 0 0",
              background: i === 6 ? "#4DA3FF" : `rgba(77,163,255,${0.25 + i * 0.08})`,
              transition: "height 1s ease",
            }} />
          ))}
        </div>
      </div>

      {/* Macro card — bottom right */}
      <div className="sl-card-float" style={{
        position: "absolute", bottom: "6%", right: "-5%",
        background: "rgba(11,14,22,0.88)", border: "1px solid rgba(102,230,255,0.22)",
        borderRadius: "14px", padding: "10px 14px", backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(7,9,13,0.6), 0 0 16px rgba(102,230,255,0.08)",
        minWidth: "115px", zIndex: 5,
      }}>
        <div style={{ fontSize: "8px", color: "#66E6FF", letterSpacing: "0.1em", marginBottom: "5px", fontWeight: 700 }}>MACROS</div>
        {[
          { label: "Protein", color: "#4DA3FF", pct: "40%" },
          { label: "Carbs", color: "#A78BFA", pct: "40%" },
          { label: "Fat", color: "#66E6FF", pct: "20%" },
        ].map(m => (
          <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: m.color, flexShrink: 0, boxShadow: `0 0 6px ${m.color}80` }} />
            <div style={{ fontSize: "9px", color: "#AAB3C5", flex: 1 }}>{m.label}</div>
            <div style={{ fontSize: "9px", color: "#F5F7FA", fontWeight: 600 }}>{m.pct}</div>
          </div>
        ))}
      </div>

      {/* Heartbeat card — top right */}
      <div className="sl-card-float-alt" style={{
        position: "absolute", top: "10%", right: "-4%",
        background: "rgba(11,14,22,0.88)", border: "1px solid rgba(77,163,255,0.2)",
        borderRadius: "14px", padding: "9px 12px", backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(7,9,13,0.6)", zIndex: 5
      }}>
        <div style={{ fontSize: "8px", color: "#4DA3FF", letterSpacing: "0.1em", marginBottom: "5px", fontWeight: 700 }}>ACTIVITY</div>
        <svg width="80" height="26" viewBox="0 0 80 26" fill="none">
          <path d="M0 13 L12 13 L16 4 L22 22 L28 10 L34 13 L80 13" stroke="#4DA3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 13 L12 13 L16 4 L22 22 L28 10 L34 13 L80 13" stroke="rgba(77,163,255,0.2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Trust Badge ────────────────────────────────────────── */
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="sl-trust-badge" style={{
      display: "inline-flex", alignItems: "center", gap: "0.4rem",
      padding: "0.3rem 0.75rem", borderRadius: "999px",
      background: "rgba(77,163,255,0.05)", border: "1px solid rgba(77,163,255,0.18)",
      fontSize: "0.72rem", fontWeight: 600, color: "#AAB3C5",
      letterSpacing: "0.03em", cursor: "default", transition: "all 0.25s ease",
    }}>
      <span style={{ fontSize: "0.8rem" }}>{icon}</span>{label}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({ icon, title, sub, accent }: { icon: string; title: string; sub: string; accent: string }) {
  return (
    <div className="sl-stat-card" style={{
      flex: "1 1 0", minWidth: "100px",
      background: "rgba(11,14,22,0.75)", border: `1px solid ${accent}22`,
      borderRadius: "16px", padding: "1rem", backdropFilter: "blur(16px)",
      transition: "all 0.3s ease", cursor: "default",
    }}>
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F5F7FA", lineHeight: 1.3, marginBottom: "0.3rem" }}>{title}</div>
      <div style={{ fontSize: "0.71rem", color: "#AAB3C5" }}>{sub}</div>
    </div>
  );
}

/* ─── HeroSection ────────────────────────────────────────── */
export function HeroSection() {
  const [mouseX, setMouseX] = useState(0.5);
  const [mouseY, setMouseY] = useState(0.5);
  const [mounted, setMounted] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  // Auto-advance slider every 5 seconds
  const advanceSlide = useCallback(() => {
    setSlideIndex(prev => (prev + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(advanceSlide, 5000);
    return () => clearInterval(id);
  }, [advanceSlide]);

  useEffect(() => {
    setMounted(true);
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setMouseX((e.clientX - r.left) / r.width);
      setMouseY((e.clientY - r.top) / r.height);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const bgX = (mouseX - 0.5) * 25;
  const bgY = (mouseY - 0.5) * 25;

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes slFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 45%{transform:translateY(-12px) rotate(0.4deg)} 85%{transform:translateY(-5px) rotate(-0.3deg)} }
        @keyframes slFloatAlt { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes slRingPulse { 0%,100%{box-shadow:0 0 30px rgba(77,163,255,.35),0 0 80px rgba(77,163,255,.12),inset 0 0 30px rgba(77,163,255,.06);opacity:1} 50%{box-shadow:0 0 55px rgba(77,163,255,.6),0 0 130px rgba(77,163,255,.2),inset 0 0 45px rgba(77,163,255,.1);opacity:.9} }
        @keyframes slRingRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slScan { 0%{transform:translateY(-110%);opacity:0} 20%{opacity:.8} 80%{opacity:.5} 100%{transform:translateY(210%);opacity:0} }
        @keyframes slShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes slFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slAura { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.12);opacity:1} }
        @keyframes slGrid { 0%,100%{opacity:.22} 50%{opacity:.38} }
        @keyframes slOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(12px,-14px) scale(1.1)} }
        @keyframes slOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-10px,10px) scale(1.08)} }
        @keyframes slBgDrift { 0%{transform:scale(1.05) translate(0,0)} 100%{transform:scale(1.08) translate(-1.5%,-1%)} }
        @keyframes slKenBurns0 { 0%{transform:scale(1.04) translate(0,0)} 100%{transform:scale(1.12) translate(-1.2%,-0.8%)} }
        @keyframes slKenBurns1 { 0%{transform:scale(1.12) translate(-1.2%,-0.8%)} 100%{transform:scale(1.04) translate(1%,0.6%)} }

        /* ── Utility classes ── */
        .sl-logo-float { animation: slFloat 6s ease-in-out infinite; }
        .sl-ring-outer { animation: slRingRotate 35s linear infinite; }
        .sl-ring-pulse { animation: slRingPulse 3.5s ease-in-out infinite; }
        .sl-scan-light { animation: slScan 4.5s ease-in-out infinite; }
        .sl-shimmer-overlay { animation: slShimmer 4s linear infinite; }
        .sl-aura-bg { animation: slAura 8s ease-in-out infinite; }
        .sl-card-float { animation: slFloat 7s ease-in-out infinite; }
        .sl-card-float-alt { animation: slFloatAlt 9s ease-in-out infinite; }
        .sl-bg-photo-layer { animation: slBgDrift 30s ease-in-out infinite alternate; }

        /* ── Ken Burns Cross-Fade Slider ── */
        .sl-kb-slide {
          position:absolute;inset:0;
          opacity:0;
          transition: opacity 1.5s cubic-bezier(0.4,0,0.2,1);
          will-change: opacity, transform;
        }
        .sl-kb-slide img {
          transform: scale(1.04);
          transition: transform 6.5s cubic-bezier(0.25,0.46,0.45,0.94);
          will-change: transform;
        }
        .sl-kb-slide.sl-kb-active {
          opacity:1;
          z-index:1;
        }
        .sl-kb-slide.sl-kb-active img {
          transform: scale(1.12);
        }

        /* ── Background slider ── */
        .sl-bg-slide {
          position:absolute;inset:0;
          opacity:0;
          transition: opacity 1.5s cubic-bezier(0.4,0,0.2,1);
          will-change: opacity;
        }
        .sl-bg-slide.sl-bg-active {
          opacity:0.12;
        }

        /* ── Entrance animations ── */
        .sl-in-1 { animation: slFadeUp .7s .1s ease both; }
        .sl-in-2 { animation: slFadeUp .7s .22s ease both; }
        .sl-in-3 { animation: slFadeUp .7s .36s ease both; }
        .sl-in-4 { animation: slFadeUp .7s .50s ease both; }
        .sl-in-5 { animation: slFadeUp .7s .64s ease both; }
        .sl-in-6 { animation: slFadeUp .7s .78s ease both; }
        .sl-in-r { animation: slFadeUp .9s .5s ease both; }

        /* ── Button styles ── */
        .sl-btn-primary {
          display:inline-flex;align-items:center;gap:.6rem;
          padding:.875rem 1.875rem;
          background:linear-gradient(135deg,rgba(77,163,255,.2) 0%,rgba(167,139,250,.2) 100%);
          border:1px solid rgba(77,163,255,.5);
          color:#66E6FF;border-radius:14px;font-weight:700;font-size:.95rem;
          text-decoration:none;white-space:nowrap;transition:all .25s ease;
          position:relative;overflow:hidden;
        }
        .sl-btn-primary::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(90deg,transparent,rgba(102,230,255,.07),transparent);
          background-size:200% 100%;animation:slShimmer 3s ease infinite;
        }
        .sl-btn-primary:hover {
          background:linear-gradient(135deg,rgba(77,163,255,.35) 0%,rgba(167,139,250,.35) 100%);
          box-shadow:0 0 40px rgba(77,163,255,.35),0 4px 24px rgba(7,9,13,.5);
          transform:translateY(-2px);border-color:rgba(77,163,255,.8);
        }
        .sl-btn-secondary {
          display:inline-flex;align-items:center;gap:.6rem;
          padding:.875rem 1.875rem;
          background:rgba(11,14,22,.65);border:1px solid rgba(77,163,255,.22);
          color:#AAB3C5;border-radius:14px;font-weight:600;font-size:.95rem;
          text-decoration:none;white-space:nowrap;transition:all .25s ease;
          backdrop-filter:blur(10px);
        }
        .sl-btn-secondary:hover { border-color:rgba(77,163,255,.5);color:#F5F7FA;transform:translateY(-2px);box-shadow:0 4px 24px rgba(7,9,13,.5); }
        .sl-btn-ghost {
          display:inline-flex;align-items:center;gap:.5rem;
          padding:.5rem 1rem;background:transparent;border:none;
          color:#66E6FF;font-weight:500;font-size:.875rem;
          text-decoration:none;cursor:pointer;transition:all .2s ease;
        }
        .sl-btn-ghost:hover { color:#F5F7FA;letter-spacing:.02em; }

        /* ── Badge & stat hover ── */
        .sl-trust-badge:hover { background:rgba(77,163,255,.12)!important;border-color:rgba(77,163,255,.38)!important;color:#F5F7FA!important;transform:translateY(-1px); }
        .sl-stat-card:hover { transform:translateY(-4px);box-shadow:0 16px 48px rgba(7,9,13,.7);border-color:rgba(77,163,255,.3)!important; }

        /* ── Scroll cue ── */
        .sl-scroll-cue { display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer; }
        .sl-scroll-arrow {
          width:28px;height:28px;border:1.5px solid rgba(77,163,255,.3);border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          animation:slFloat 2.2s ease-in-out infinite;transition:border-color .2s;
        }
        .sl-scroll-cue:hover .sl-scroll-arrow { border-color:rgba(77,163,255,.7); }

        /* ── Responsive ── */
        @media(max-width:960px) {
          .sl-split { flex-direction:column!important; }
          .sl-left { text-align:center!important;align-items:center!important; }
          .sl-cta-row { justify-content:center!important;flex-wrap:wrap!important; }
          .sl-badges { justify-content:center!important; }
          .sl-stats { flex-wrap:wrap!important; }
          .sl-right { max-width:420px;width:100%;margin-top:1.5rem; }
        }
        @media(max-width:540px) {
          .sl-btn-primary,.sl-btn-secondary { width:100%;justify-content:center; }
          .sl-cta-row { flex-direction:column!important; }
          .sl-stat-card { min-width:calc(50% - .4rem)!important; }
          .sl-logo-float { animation-duration:8s; }
          .sl-card-float,.sl-card-float-alt { animation-duration:10s; }
        }
        @media(prefers-reduced-motion:reduce) {
          .sl-logo-float,.sl-ring-outer,.sl-ring-pulse,.sl-aura-bg,
          .sl-card-float,.sl-card-float-alt,.sl-scan-light,.sl-shimmer-overlay,
          .sl-scroll-arrow,.sl-in-1,.sl-in-2,.sl-in-3,.sl-in-4,.sl-in-5,.sl-in-6,.sl-in-r { animation:none!important; }
          .sl-kb-slide img, .sl-bg-slide { transition:none!important; }
        }
      `}</style>

      <section
        ref={heroRef}
        aria-label="Hero section"
        style={{ minHeight: "100svh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", background: "#07090D" }}
      >
        {/* Particle field */}
        {mounted && <ParticleField />}

        {/* Responsive gradient background with parallax */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 55% at ${50 + bgX * 0.3}% ${-5 + bgY * 0.2}%, rgba(77,163,255,.12) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at ${85 + bgX * 0.15}% 80%, rgba(167,139,250,.1) 0%, transparent 55%),
            radial-gradient(ellipse 35% 30% at 15% 65%, rgba(102,230,255,.05) 0%, transparent 50%)
          `,
          transition: "background .15s ease-out",
        }} />

        {/* Digital mesh grid */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(77,163,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(77,163,255,.035) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          mask: "radial-gradient(ellipse 90% 90% at 50% 50%,black 25%,transparent 100%)",
          WebkitMask: "radial-gradient(ellipse 90% 90% at 50% 50%,black 25%,transparent 100%)",
          animation: "slGrid 9s ease-in-out infinite",
        }} />

        {/* Ghosted mega background circle (logo-inspired shape) */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "50%", left: "50%", zIndex: 0, pointerEvents: "none",
          width: "min(95vw, 950px)", height: "min(95vw, 950px)",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%", border: "1px solid rgba(77,163,255,.04)",
          background: "radial-gradient(circle, rgba(77,163,255,.02) 0%, transparent 60%)",
          animation: "slAura 14s ease-in-out infinite",
        }} />

        {/* Neon orbs */}
        <div aria-hidden="true" style={{ position: "absolute", top: "10%", left: "5%", width: "320px", height: "320px", background: "radial-gradient(circle,rgba(77,163,255,.09) 0%,transparent 70%)", filter: "blur(60px)", animation: "slOrb1 11s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: "10%", right: "5%", width: "400px", height: "400px", background: "radial-gradient(circle,rgba(167,139,250,.08) 0%,transparent 70%)", filter: "blur(70px)", animation: "slOrb2 15s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

        {/* Animated Background Photo Sequence (Cross-Fade) */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          overflow: "hidden",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}>
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={`bg-${slide.src}`}
              className={i === slideIndex ? "sl-bg-slide sl-bg-active" : "sl-bg-slide"}
              style={{ position: "absolute", inset: "-5%", filter: "blur(3px)" }}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                priority={i === 0}
                style={{ objectFit: "cover", objectPosition: slide.pos }}
              />
            </div>
          ))}
          {/* Darkening overlays to blend photos into dark background */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(7,9,13,1) 0%, rgba(7,9,13,0.3) 50%, rgba(7,9,13,1) 100%)", zIndex: 2 }} />
        </div>

        {/* HUD lines SVG */}
        <svg aria-hidden="true" viewBox="0 0 1400 900" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .06, pointerEvents: "none", zIndex: 0 }}>
          <line x1="0" y1="450" x2="200" y2="450" stroke="#4DA3FF" strokeWidth=".5" />
          <line x1="1200" y1="450" x2="1400" y2="450" stroke="#4DA3FF" strokeWidth=".5" />
          <line x1="700" y1="0" x2="700" y2="100" stroke="#4DA3FF" strokeWidth=".5" />
          <line x1="700" y1="800" x2="700" y2="900" stroke="#4DA3FF" strokeWidth=".5" />
          <circle cx="700" cy="450" r="310" stroke="#4DA3FF" strokeWidth=".5" fill="none" />
          <circle cx="700" cy="450" r="450" stroke="#A78BFA" strokeWidth=".4" fill="none" strokeDasharray="3 22" />
        </svg>

        {/* ── Main Content ── */}
        <div
          className="sl-split"
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            gap: "clamp(2rem,5vw,5rem)",
            maxWidth: "1280px", margin: "0 auto",
            padding: "clamp(100px,12vh,130px) 1.5rem clamp(2.5rem,5vh,4rem)",
            width: "100%", position: "relative", zIndex: 1,
          }}
        >
          {/* ── LEFT ── */}
          <div className="sl-left" style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column" }}>

            {/* Eyebrow */}
            <div className="sl-in-1" style={{ marginBottom: "1.5rem" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: ".5rem",
                padding: ".35rem 1rem", borderRadius: "999px",
                background: "rgba(77,163,255,.08)", border: "1px solid rgba(77,163,255,.25)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4DA3FF", boxShadow: "0 0 8px #4DA3FF", display: "inline-block" }} />
                <span style={{ color: "#4DA3FF", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".1em" }}>SANDY.LIFTS FITNESS SYSTEM</span>
              </div>
            </div>

            {/* Headline */}
            <div className="sl-in-2">
              <h1 style={{ fontSize: "clamp(2.6rem,5.5vw,4.8rem)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.08, marginBottom: "1.4rem", color: "#F5F7FA" }}>
                Lift Smarter.<br />
                <span style={{ background: "linear-gradient(135deg,#4DA3FF 0%,#66E6FF 40%,#A78BFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Transform Harder.
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <div className="sl-in-3">
              <p style={{ fontSize: "clamp(.95rem,1.8vw,1.1rem)", color: "#AAB3C5", lineHeight: 1.75, maxWidth: "480px", marginBottom: "2.2rem" }}>
                Science-backed fat loss. No bro-science, no fluff — just practical nutrition, honest calorie guidance, and real transformation built around your lifestyle.
              </p>
            </div>

            {/* CTAs */}
            <div className="sl-in-4 sl-cta-row" style={{ display: "flex", gap: ".875rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <Link href="/tools" className="sl-btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Start Your Transformation
              </Link>
              <Link href="/tools" className="sl-btn-secondary">
                Explore Tools
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link href="/about" className="sl-btn-ghost">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                Watch My Journey
              </Link>
            </div>

            {/* Trust badges */}
            <div className="sl-in-5 sl-badges" style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "2.2rem" }}>
              <TrustBadge icon="🔬" label="Science-Based" />
              <TrustBadge icon="🔥" label="Fat Loss Focused" />
              <TrustBadge icon="🥗" label="Practical Nutrition" />
              <TrustBadge icon="📈" label="Real Transformation" />
              <TrustBadge icon="🚫" label="No Bro-Science" />
            </div>

            {/* Stat cards */}
            <div className="sl-in-6 sl-stats" style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <StatCard icon="🎯" title="Smart Calorie Guidance" sub="100% Practical Approach" accent="#4DA3FF" />
              <StatCard icon="📊" title="Science-Backed Content" sub="Progress Driven" accent="#A78BFA" />
              <StatCard icon="⚡" title="Transformation Tracking" sub="Simple Food Strategy" accent="#66E6FF" />
            </div>
          </div>

          {/* ── RIGHT — Hero Image Slider ── */}
          <div className="sl-right sl-in-r" style={{ flex: "0 0 auto", width: "clamp(300px,42vw,520px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoShowcase mouseX={mouseX} mouseY={mouseY} slideIndex={slideIndex} />
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", paddingBottom: "2.5rem" }}>
          <div className="sl-scroll-cue" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}>
            <span style={{ fontSize: ".68rem", color: "#AAB3C5", letterSpacing: ".1em", textTransform: "uppercase" }}>Scroll to Explore</span>
            <div className="sl-scroll-arrow">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4DA3FF" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
