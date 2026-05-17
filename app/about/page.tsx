"use client";
import {
  ArrowRight, Activity, Zap, ShieldCheck, Users, Dumbbell,
  Target, CheckCircle2, Star, Code2, TrendingUp, Heart,
  Lightbulb, BookOpen, Brain, Award, Globe, Layers
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Premium dynamic imports from the assets folder mapping exact names.
import founderAboutImg from "../../assets/sandy founder.png";
import sidImg from "../../assets/sid.jpeg";
import himanshuImg from "../../assets/himashu kumar.jpeg";

/* ─────────────────────────────────────────────
   Scroll-reveal hook
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setVisible(true); 
          io.disconnect(); 
        } 
      },
      { threshold: 0, rootMargin: "50px" }
    );
    io.observe(el);
    
    // Fallback: If IO fails to trigger due to layout issues, force visibility after 800ms
    const fallback = setTimeout(() => {
      setVisible(true);
    }, 800);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);
  return { ref, visible };
}

/* ─────────────────────────────────────────────
   Animated floating-glow background image wrapper
───────────────────────────────────────────── */
function FounderImageBox() {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-40px)",
        transition: "opacity 0.9s ease, transform 0.9s ease",
      }}
    >
      {/* animated gradient glow ring */}
      <div style={{
        position: "absolute", inset: "-24px",
        borderRadius: "60% 40% 50% 50% / 50% 50% 60% 40%",
        background: "conic-gradient(from 220deg, #00c8ff22, #7b6fff33, #00c8ff11, #7b6fff22, #00c8ff22)",
        filter: "blur(32px)",
        animation: "glowRotate 8s linear infinite",
        zIndex: 0,
      }} />
      {/* floating card */}
      <div style={{
        position: "relative", zIndex: 2,
        borderRadius: "28px",
        overflow: "hidden",
        border: "1.5px solid rgba(0, 200, 255, 0.25)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,200,255,0.12)",
        background: "linear-gradient(160deg, rgba(12,15,24,0.9), rgba(6,8,14,0.95))",
        animation: "floatImage 6s ease-in-out infinite",
      }}>
        <Image
          src={founderAboutImg}
          alt="Sandy – Founder of Sandy.Lifts"
          width={420}
          height={520}
          className="founder-img-fx"
          style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", objectPosition: "top" }}
          priority
        />
        {/* overlay gradient to blend into dark site */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(to top, rgba(4,5,9,0.85) 0%, transparent 100%)",
        }} />
        {/* badge */}
        <div style={{
          position: "absolute", bottom: "20px", left: "20px",
          background: "rgba(6, 8, 14, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,200,255,0.35)",
          borderRadius: "12px",
          padding: "10px 18px",
          color: "#00c8ff",
          fontWeight: 800,
          fontSize: "0.82rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          boxShadow: "0 0 20px rgba(0,200,255,0.2)"
        }}>
          Founder · Sandy.Lifts
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Trust Highlight Card
───────────────────────────────────────────── */
function TrustCard({ icon, label, delay = 0 }: { icon: React.ReactNode; label: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(145deg, rgba(15,18,28,0.85), rgba(10,12,20,0.92))",
        border: "1px solid rgba(0,200,255,0.15)",
        borderTop: "1px solid rgba(0,200,255,0.3)",
        borderRadius: "16px",
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        transition: "all 0.3s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,200,255,0.12)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.35)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.15)";
      }}
    >
      <div style={{
        width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
        background: "rgba(0,200,255,0.08)",
        border: "1px solid rgba(0,200,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <span style={{ color: "#cbd5e1", fontSize: "0.92rem", fontWeight: 600, lineHeight: 1.4 }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Team Card
───────────────────────────────────────────── */
interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  transformation?: string;
  highlights: string[];
  note?: string;
  image?: string;
  imagePosition?: string;
  initials?: string;
  accentColor: string;
  delay?: number;
}

function TeamCard({ member }: { member: TeamMember }) {
  const { ref, visible } = useReveal();
  const hasImage = !!member.image;

  return (
    <div
      id={member.id}
      ref={ref}
      className="team-card-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(160deg, rgba(13,16,26,0.9), rgba(8,10,18,0.95))",
        border: `1px solid rgba(${member.accentColor}, 0.18)`,
        borderTop: `1px solid rgba(${member.accentColor}, 0.45)`,
        borderRadius: "24px",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        transitionDelay: `${member.delay || 0}ms`,
        cursor: "default",
        position: "relative",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(${member.accentColor},0.15)`;
        (e.currentTarget as HTMLElement).style.borderColor = `rgba(${member.accentColor},0.4)`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = `rgba(${member.accentColor},0.18)`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, transparent, rgba(${member.accentColor},0.8), transparent)`,
      }} />

      {/* Image or Avatar */}
      <div style={{
        position: "relative",
        height: "280px", // Consistent height for ALL cards
        width: "100%",
        overflow: "hidden",
        flexShrink: 0,
        background: `linear-gradient(135deg, rgba(${member.accentColor},0.06), rgba(10,12,20,0.8))`,
      }}>
        {hasImage ? (
          <>
            <Image
              src={member.image!}
              alt={member.name}
              fill
              className="team-avatar-img"
              style={{ 
                objectFit: "cover", 
                objectPosition: member.imagePosition || "top center"
              }}
            />
            {/* cinematic overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to bottom, transparent 40%, rgba(${member.accentColor},0.08) 70%, rgba(8,10,18,0.95) 100%)`,
            }} />
            {/* animated glow behind photo */}
            <div style={{
              position: "absolute", top: "-20px", left: "50%", transform: "translateX(-50%)",
              width: "180px", height: "180px", borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${member.accentColor},0.15) 0%, transparent 70%)`,
              filter: "blur(20px)",
              animation: "glowPulse 4s ease-in-out infinite",
            }} />
          </>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "100%", flexDirection: "column", gap: "8px",
          }}>
            {/* premium initials avatar */}
            <div style={{
              width: "100px", height: "100px", borderRadius: "50%",
              background: `conic-gradient(from 220deg, rgba(${member.accentColor},0.4), rgba(${member.accentColor},0.1), rgba(${member.accentColor},0.4))`,
              border: `2px solid rgba(${member.accentColor},0.5)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", fontWeight: 900, color: "#fff",
              boxShadow: `0 0 40px rgba(${member.accentColor},0.2)`,
              letterSpacing: "0.05em",
              animation: "glowPulse 5s ease-in-out infinite",
            }}>
              {member.initials}
            </div>
            <div style={{
              padding: "4px 14px", borderRadius: "100px",
              background: `rgba(${member.accentColor},0.1)`,
              border: `1px solid rgba(${member.accentColor},0.3)`,
              color: `rgba(${member.accentColor},1)`,
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Privacy Respected
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "32px" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#f8fafc", marginBottom: "4px", letterSpacing: "-0.01em" }}>
          {member.name}
        </h3>
        <p style={{
          fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: `rgba(${member.accentColor},0.9)`, marginBottom: "18px",
        }}>
          {member.role}
        </p>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "#94a3b8", marginBottom: member.transformation ? "16px" : "20px" }}>
          {member.description}
        </p>
        {member.transformation && (
          <div style={{
            padding: "14px 18px", marginBottom: "20px",
            background: `rgba(${member.accentColor},0.06)`,
            border: `1px solid rgba(${member.accentColor},0.2)`,
            borderRadius: "12px",
          }}>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#94a3b8", fontStyle: "italic" }}>
              {member.transformation}
            </p>
          </div>
        )}

        {/* Highlight chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto", marginBottom: member.note ? "16px" : "0" }}>
          {member.highlights.map((h) => (
            <span key={h} style={{
              padding: "5px 12px", borderRadius: "100px",
              background: `rgba(${member.accentColor},0.08)`,
              border: `1px solid rgba(${member.accentColor},0.25)`,
              color: `rgba(${member.accentColor},0.9)`,
              fontSize: "0.75rem", fontWeight: 600,
            }}>
              {h}
            </span>
          ))}
        </div>

        {member.note && (
          <p style={{
            marginTop: "16px", fontSize: "0.85rem", lineHeight: 1.6,
            color: "#64748b", fontStyle: "italic",
            borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "14px",
          }}>
            {member.note}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section wrapper with reveal
───────────────────────────────────────────── */
function RevealSection({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function AboutPage() {
  const trustCards = [
    { icon: <Activity size={18} color="#00c8ff" />, label: "4–5 Years Real Fitness Experience" },
    { icon: <TrendingUp size={18} color="#7b6fff" />, label: "Real-Life Transformation Journey" },
    { icon: <Brain size={18} color="#00c8ff" />, label: "Science-Based Guidance" },
    { icon: <Zap size={18} color="#7b6fff" />, label: "20+ Free AI Tools" },
    { icon: <Heart size={18} color="#00c8ff" />, label: "Practical Home-Food Solutions" },
    { icon: <ShieldCheck size={18} color="#7b6fff" />, label: "Real Support, No Bro-Science" },
  ];

  const timeline = [
    { phase: "01", label: "Skinny Start", sub: "The beginning of the journey", emoji: "🌱" },
    { phase: "02", label: "Better Physique", sub: "Foundation built through discipline", emoji: "💪" },
    { phase: "03", label: "105 KG", sub: "Heavy bulk phase — lived it fully", emoji: "⚡" },
    { phase: "04", label: "~85 KG Now", sub: "Refined, lean & sustainable", emoji: "🎯" },
    { phase: "05", label: "Helping Others", sub: "Turning experience into a mission", emoji: "🌟" },
  ];

  const teamMembers: TeamMember[] = [
    {
      id: "sandy",
      name: "Sandy",
      role: "Founder · Fitness Educator · Platform Vision",
      description:
        "Sandy is the founder of Sandy.Lifts and the driving force behind the platform's mission. His role is to simplify fitness through science-based guidance, real-life transformation lessons, practical nutrition, beginner-friendly systems, and accessible tools. He leads the content direction, platform vision, user education, and the overall transformation experience.",
      highlights: ["Founder Vision", "Fitness Education", "Transformation Guidance", "Content Direction", "Platform Strategy"],
      image: founderAboutImg.src,
      accentColor: "0, 200, 255",
      delay: 0,
    },
    {
      id: "sid",
      name: "Sayed Gulam Hussain",
      role: "Digital Marketing Manager",
      description:
        "Sayed is the Digital Marketing Manager and one of the best in his field, known for his creative vision, strategic thinking, and impactful execution. He plays a key role in building the platform's digital presence, audience growth, creative positioning, social visibility, and online reach. He helps shape how the brand connects with people and expands its impact in the digital world.",
      transformation:
        "Sayed lost around 30 kg during his prime and now maintains a strong, disciplined physique while living in Dubai and managing a professional career. His journey reflects consistency, self-improvement, and the same transformation mindset Sandy.Lifts stands for.",
      highlights: ["Brand Growth Strategy", "Digital Marketing", "Social Positioning", "Creative Direction", "Audience Engagement"],
      note: "Sayed brings both professional marketing expertise and personal transformation credibility to the Sandy.Lifts mission.",
      image: sidImg.src,
      accentColor: "123, 111, 255",
      delay: 100,
    },
    {
      id: "himanshu",
      name: "Himanshu Pal",
      role: "Senior Software Engineer",
      description:
        "Himanshu Pal is a Senior Software Engineer and one of the best in his field, recognized for his technical excellence, problem-solving ability, and dependable development work. He is responsible for building, structuring, optimizing, and maintaining the website experience so that the platform feels fast, modern, functional, and user-friendly.",
      transformation:
        "Himanshu reduced around 10 kg of fat and maintains a strong physique while living in Dubai and managing a professional career. His journey reflects balance, consistency, and the ability to build both body and career with discipline.",
      highlights: ["Full Stack Development", "Frontend & Backend", "Performance Optimization", "Technical Problem Solving", "Platform Maintenance"],
      note: "Himanshu brings technical precision and personal discipline to the Sandy.Lifts ecosystem.",
      image: himanshuImg.src,
      imagePosition: "center 10%",
      accentColor: "0, 200, 255",
      delay: 200,
    },
    {
      id: "simi",
      name: "Simi Kumari",
      role: "Marketing Business Manager",
      description:
        "Simi Kumari supports Sandy.Lifts as Marketing Business Manager. Her role focuses on client relations, communication flow, business coordination, and maintaining a strong bridge between the platform and the people it serves. She contributes to the relationship-building side of the brand with professionalism and clarity.",
      highlights: ["Client Relationship Mgmt", "Communication Coordination", "Business Support", "UX Support", "Relationship Building"],
      initials: "SK",
      accentColor: "123, 111, 255",
      delay: 300,
    },
    {
      id: "priya",
      name: "Priya Rani",
      role: "Senior Agency Manager",
      description:
        "Priya Rani contributes to Sandy.Lifts through her strength in client relationship management and people handling. As a Senior Agency Manager, she brings experience in managing communication, maintaining trust with clients, and supporting relationship-based growth. Her role adds reliability, professionalism, and people-centered value to the platform.",
      highlights: ["Client Relationship Support", "People Handling", "Trust-Based Communication", "Relationship Management", "Support Coordination"],
      initials: "PR",
      accentColor: "0, 200, 255",
      delay: 400,
    },
  ];

  return (
    <div style={{ backgroundColor: "#040509", minHeight: "100vh", position: "relative", overflow: "hidden", color: "#E2E8F0" }}>

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }

        .founder-img-fx {
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s ease;
        }
        .founder-img-fx:hover {
          transform: scale(1.03);
          filter: brightness(1.05) contrast(1.02);
        }

        .team-avatar-img {
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s ease;
          filter: brightness(0.95);
        }
        .team-card-wrapper:hover .team-avatar-img {
          transform: scale(1.05);
          filter: brightness(1.05) contrast(1.05);
        }

        .about-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(0, 200, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 200, 255, 0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent 75%);
        }
        .glow-blob {
          position: absolute; border-radius: 50%; filter: blur(130px); opacity: 0.12; z-index: 0; pointer-events: none;
        }

        @keyframes glowRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes floatImage {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes timelinePop {
          0%   { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #9ca3af 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .neon-accent {
          background: linear-gradient(135deg, #00c8ff, #7b6fff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .highlight-text {
          background: linear-gradient(90deg, #00c8ff, #7b6fff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .section-label {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 8px 20px; border-radius: 100px;
          border: 1px solid rgba(0, 200, 255, 0.35);
          background: rgba(0, 200, 255, 0.07);
          color: #00c8ff; font-weight: 800; letter-spacing: 3px;
          text-transform: uppercase; font-size: 0.75rem;
          box-shadow: 0 0 20px rgba(0,200,255,0.12);
          margin-bottom: 28px;
        }

        .story-card {
          background: linear-gradient(180deg, rgba(15,18,28,0.8), rgba(10,12,18,0.92));
          border: 1px solid rgba(123,111,255,0.14);
          border-top: 1px solid rgba(0,200,255,0.3);
          border-radius: 24px;
          padding: 44px;
          position: relative; overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .story-card::before {
          content: "";
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.7), transparent);
        }
        .story-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,200,255,0.1);
        }

        .timeline-track {
          display: flex; justify-content: space-between; position: relative; margin-top: 56px;
        }
        .timeline-line {
          position: absolute; top: 30px; left: 6%; right: 6%; height: 2px;
          background: linear-gradient(90deg,
            rgba(0,200,255,0.0) 0%,
            rgba(0,200,255,0.5) 25%,
            rgba(123,111,255,0.6) 50%,
            rgba(0,200,255,0.5) 75%,
            rgba(0,200,255,0.0) 100%
          );
          z-index: 1;
        }
        .timeline-step {
          z-index: 2; display: flex; flex-direction: column; align-items: center;
          gap: 16px; width: 20%; text-align: center;
        }
        .timeline-dot {
          width: 60px; height: 60px; border-radius: 50%;
          background: rgba(4,5,9,0.9);
          border: 2px solid rgba(0,200,255,0.5);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
          box-shadow: 0 0 20px rgba(0,200,255,0.2);
          transition: all 0.3s ease;
          position: relative;
        }
        .timeline-step:hover .timeline-dot {
          border-color: #00c8ff;
          box-shadow: 0 0 40px rgba(0,200,255,0.45), 0 0 0 8px rgba(0,200,255,0.08);
          transform: scale(1.15);
        }

        .cta-primary {
          padding: 16px 36px; border-radius: 14px; font-weight: 800; font-size: 1.05rem;
          display: inline-flex; align-items: center; gap: 10px; text-decoration: none;
          background: linear-gradient(135deg, #00c8ff 0%, #7b6fff 100%);
          color: #000; box-shadow: 0 0 30px rgba(0, 200, 255, 0.35); border: none;
          transition: all 0.3s;
        }
        .cta-primary:hover {
          box-shadow: 0 0 50px rgba(123, 111, 255, 0.6); transform: translateY(-3px);
        }
        .cta-secondary {
          padding: 16px 36px; border-radius: 14px; font-weight: 800; font-size: 1.05rem;
          display: inline-flex; align-items: center; gap: 10px; text-decoration: none;
          background: rgba(123, 111, 255, 0.1); color: #7b6fff;
          border: 1px solid rgba(123, 111, 255, 0.4);
          transition: all 0.3s;
        }
        .cta-secondary:hover {
          background: rgba(123, 111, 255, 0.2);
          box-shadow: 0 0 30px rgba(123, 111, 255, 0.3); transform: translateY(-3px);
        }

        @media (max-width: 900px) {
          .founder-grid { flex-direction: column !important; }
          .founder-image-col { max-width: 100% !important; }
          .timeline-track { flex-direction: column; gap: 36px; margin-top: 32px; }
          .timeline-line { top: 0; bottom: 0; left: 29px; width: 2px; height: auto; }
          .timeline-step { width: 100%; flex-direction: row; text-align: left; gap: 20px; }
          .team-grid { grid-template-columns: 1fr !important; }
          .story-card { padding: 28px; }
          .about-main { padding: 120px 20px 80px !important; }
        }
        @media (max-width: 640px) {
          .about-main { padding: 100px 16px 60px !important; }
        }
        @media (max-width: 860px) {
          .mission-grid { grid-template-columns: 1fr !important; }
          .trust-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Background ── */}
      <div className="about-grid" />
      <div className="glow-blob" style={{ background: "#00c8ff", width: "700px", height: "700px", top: "-200px", left: "-200px" }} />
      <div className="glow-blob" style={{ background: "#7b6fff", width: "800px", height: "800px", bottom: "0%", right: "-250px" }} />
      <div className="glow-blob" style={{ background: "#00c8ff", width: "400px", height: "400px", top: "40%", right: "10%" }} />

      {/* ══════════════════════════════════════════════
          SECTION 1: ABOUT HERO + FOUNDER STORY
      ══════════════════════════════════════════════ */}
      <div className="about-main" style={{ position: "relative", zIndex: 10, maxWidth: "1160px", margin: "0 auto", padding: "140px 28px 100px" }}>

        {/* Label */}
        <RevealSection style={{ textAlign: "center" }}>
          <div className="section-label">
            <Star size={14} /> About Sandy.Lifts
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)", fontWeight: 900, lineHeight: 1.18, letterSpacing: "-0.04em", marginBottom: "20px" }}>
            <span className="gradient-text">Built from real struggle.</span><br />
            <span className="gradient-text">Backed by real experience.</span><br />
            <span className="neon-accent">Focused on real transformation.</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.15rem", maxWidth: "560px", margin: "0 auto 60px", lineHeight: 1.7 }}>
            A platform built to make fitness simpler, smarter, and more accessible for everyone.
          </p>
        </RevealSection>

        {/* ── Founder Two-Column ── */}
        <div
          className="founder-grid"
          style={{ display: "flex", gap: "64px", alignItems: "flex-start", marginBottom: "80px" }}
        >
          {/* Left: Portrait */}
          <div className="founder-image-col" style={{ flex: "0 0 380px", maxWidth: "380px" }}>
            <FounderImageBox />
          </div>

          {/* Right: Story */}
          <div style={{ flex: 1 }}>
            <RevealSection delay={150}>
              <div style={{ marginBottom: "32px" }}>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#00c8ff", marginBottom: "6px" }}>
                  Hey learner, I'm Sandeep Kumar.
                </p>
                <p style={{ fontSize: "1.05rem", color: "#64748b", fontWeight: 600, marginBottom: "0" }}>
                  You can call me <strong style={{ color: "#f8fafc" }}>Sandy</strong> — the person behind Sandy.Lifts.
                </p>
              </div>

              <p style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#94a3b8", marginBottom: "20px" }}>
                This platform was born during one of the hardest phases of my life. After facing a study visa rejection
                and stepping away from a good job, I took a pause and decided to build something meaningful. With the
                support of my elder brother and the belief that I could create real value, I chose to turn my fitness
                journey into a mission.
              </p>

              <p style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#94a3b8", marginBottom: "20px" }}>
                I'm not here with 4 days of motivation. I've given{" "}
                <span className="highlight-text">4–5 years to fitness</span> and lived through multiple phases myself
                — from being skinny, to building a better physique, to reaching 105 kg, and then transforming back to
                around 85 kg. That journey taught me what actually works in real life.
              </p>

              <p style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "#94a3b8", marginBottom: "32px" }}>
                Sandy.Lifts is for anyone who wants better health, fat loss, muscle gain, and honest guidance without
                confusion. What makes this platform different:{" "}
                <span className="highlight-text">science-based guidance</span>,{" "}
                <span className="highlight-text">no bro-science</span>,{" "}
                <span className="highlight-text">practical nutrition</span>, home-food solutions, and real support.
                Along with{" "}
                <span className="highlight-text">20+ free AI tools</span> to help beginners and intermediate learners
                get clarity and action steps — without hidden charges.
              </p>

              {/* Trust Cards */}
              <div className="trust-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {trustCards.map((c, i) => (
                  <TrustCard key={c.label} icon={c.icon} label={c.label} delay={i * 60} />
                ))}
              </div>
            </RevealSection>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            SECTION 2: MISSION + DIFFERENTIATORS
        ══════════════════════════════════════════════ */}
        <RevealSection style={{ marginBottom: "80px" }}>
          <div className="story-card">
            <div className="mission-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
              {/* Mission */}
              <div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", marginBottom: "18px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Star color="#00c8ff" size={22} />
                  </div>
                  The Mission
                </h2>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#94a3b8", marginBottom: "24px" }}>
                  My mission is to make fitness simpler, smarter, and more accessible — so more people can transform
                  with <span className="highlight-text">confidence, not confusion</span>.
                </p>
                <div style={{
                  padding: "20px 24px",
                  background: "rgba(0,200,255,0.05)",
                  border: "1px solid rgba(0,200,255,0.25)",
                  borderRadius: "16px",
                }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "#00c8ff", marginBottom: "4px" }}>20+</div>
                  <div style={{ color: "#e2e8f0", fontSize: "0.98rem", lineHeight: 1.5 }}>
                    Free AI tools for beginners and intermediate learners — zero hidden charges.
                  </div>
                </div>
                <div style={{ marginTop: "20px", padding: "14px 20px", background: "rgba(123,111,255,0.05)", border: "1px solid rgba(123,111,255,0.2)", borderRadius: "12px", color: "#94a3b8", fontSize: "1rem", fontStyle: "italic" }}>
                  "Start your transformation. Explore the tools. Build with Sandy.Lifts."
                </div>
              </div>

              {/* What Makes It Different */}
              <div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", marginBottom: "18px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(123,111,255,0.1)", border: "1px solid rgba(123,111,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck color="#7b6fff" size={22} />
                  </div>
                  Why Sandy.Lifts?
                </h2>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#94a3b8", marginBottom: "24px" }}>
                  Sandy.Lifts is for anyone who wants better health, fat loss, muscle gain, and honest guidance without
                  confusion. Fitness is for every age — because health is wealth.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { label: "Science-based guidance", icon: <Brain size={16} color="#7b6fff" /> },
                    { label: "No bro-science — ever", icon: <ShieldCheck size={16} color="#00c8ff" /> },
                    { label: "Practical nutrition", icon: <Heart size={16} color="#7b6fff" /> },
                    { label: "Home-food solutions", icon: <Lightbulb size={16} color="#00c8ff" /> },
                    { label: "Real support & accountability", icon: <Users size={16} color="#7b6fff" /> },
                  ].map(item => (
                    <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.98rem", color: "#cbd5e1" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ══════════════════════════════════════════════
            SECTION 3: TRANSFORMATION TIMELINE
        ══════════════════════════════════════════════ */}
        <RevealSection style={{ marginBottom: "100px" }}>
          <div className="story-card">
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <div className="section-label" style={{ marginBottom: "16px" }}>
                <TrendingUp size={14} /> Founder Transformation
              </div>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: "10px" }}>
                The 5-Phase Journey
              </h2>
              <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
                Lived through every struggle so you don't have to guess. Real phases, real lessons.
              </p>
            </div>

            <div className="timeline-track">
              <div className="timeline-line" />
              {timeline.map((step, i) => (
                <div key={step.phase} className="timeline-step" style={{ animationDelay: `${i * 120}ms` }}>
                  <div className="timeline-dot">
                    {step.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: "#00c8ff", textTransform: "uppercase", marginBottom: "4px" }}>
                      Phase {step.phase}
                    </div>
                    <h4 style={{ color: "#f8fafc", fontWeight: 800, fontSize: "1rem", marginBottom: "4px" }}>{step.label}</h4>
                    <p style={{ color: "#64748b", fontSize: "0.83rem", lineHeight: 1.5 }}>{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ══════════════════════════════════════════════
            SECTION 4: TEAM SECTION
        ══════════════════════════════════════════════ */}
        <RevealSection style={{ marginBottom: "60px", textAlign: "center" }}>
          <div className="section-label">
            <Users size={14} /> The Team
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, color: "#fff", marginBottom: "20px", letterSpacing: "-0.03em" }}>
            The People Behind <span className="neon-accent">Sandy.Lifts</span>
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
            Sandy.Lifts is built not only on personal transformation, but also on the support of skilled people who
            believe in practical growth, discipline, consistency, and real results.
          </p>
        </RevealSection>

        {/* Team Grid */}
        <div
          className="team-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px", marginBottom: "60px" }}
        >
          {teamMembers.slice(0, 3).map(m => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>
        <div
          className="team-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px", marginBottom: "60px", maxWidth: "780px", margin: "0 auto 60px" }}
        >
          {teamMembers.slice(3).map(m => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>

        {/* ── Mission Strip ── */}
        <RevealSection style={{ marginBottom: "80px" }}>
          <div style={{
            textAlign: "center",
            padding: "40px 48px",
            background: "linear-gradient(135deg, rgba(0,200,255,0.05), rgba(123,111,255,0.08))",
            border: "1px solid rgba(0,200,255,0.2)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(123,111,255,0.4), transparent)" }} />
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#94a3b8", maxWidth: "700px", margin: "0 auto" }}>
              Together, this team combines{" "}
              <span className="highlight-text">transformation</span>,{" "}
              <span className="highlight-text">technology</span>,{" "}
              <span className="highlight-text">marketing</span>, and{" "}
              <span className="highlight-text">relationship-driven support</span>{" "}
              to make Sandy.Lifts more practical, accessible, and impactful.
            </p>
          </div>
        </RevealSection>

        {/* ══════════════════════════════════════════════
            SECTION 5: CTA
        ══════════════════════════════════════════════ */}
        <RevealSection>
          <div style={{
            textAlign: "center",
            padding: "80px 40px",
            background: "linear-gradient(180deg, rgba(123,111,255,0.07), rgba(0,200,255,0.12))",
            borderRadius: "32px",
            border: "1px solid rgba(0,200,255,0.3)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* top shimmer */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #00c8ff, transparent)" }} />
            {/* glow blob */}
            <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,255,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="section-label" style={{ marginBottom: "24px" }}>
                <Zap size={14} /> Start Your Journey
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: "18px", letterSpacing: "-0.03em" }}>
                Ready to transform with{" "}
                <span className="neon-accent">clarity</span>, not confusion?
              </h2>
              <p style={{ color: "#6b7280", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.7 }}>
                Explore tools, learn the basics, and build your journey with the right guidance.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                <Link href="/tools" className="cta-primary">
                  Explore Free Tools <ArrowRight size={20} />
                </Link>
                <Link href="/ai-coach" className="cta-secondary">
                  Start Your Journey
                </Link>
              </div>
            </div>
          </div>
        </RevealSection>

      </div>
    </div>
  );
}
