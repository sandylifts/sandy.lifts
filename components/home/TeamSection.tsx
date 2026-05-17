"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import founderImg from "../../assets/sandy founder.png";
import sayedImg from "../../assets/sayed gulam hussain.jpeg";
import himanshuImg from "../../assets/himashu kumar.jpeg";

const TEAM = [
  {
    id: "sandy",
    name: "Sandy",
    role: "Founder & Head Coach",
    desc: "The visionary behind Sandy.Lifts. Simplifying fitness through science-based guidance and real-world transformation experience.",
    image: founderImg,
    imgPosition: "center 10%",
    accent: "#00c8ff",
  },
  {
    id: "sid",
    name: "Sayed Gulam Hussain",
    role: "Digital Marketing Manager • Dubai",
    desc: "The strategic mind driving our global brand. Based in Dubai, Sayed combines elite digital marketing expertise with a personal 30kg fitness transformation—embodying the relentless discipline that powers Sandy.Lifts.",
    image: sayedImg,
    imgPosition: "center 10%",
    accent: "#7b6fff",
  },
  {
    id: "himanshu",
    name: "Himanshu Pal",
    role: "Senior Software Engineer • Dubai",
    desc: "The engineering force behind our seamless platform. Based in Dubai, Himanshu blends technical precision with a personal 10kg fitness transformation—building the ultimate 1% digital experience.",
    image: himanshuImg,
    imgPosition: "center top",
    accent: "#00c8ff",
  },
  {
    id: "simi",
    name: "Simi Kumari",
    role: "Marketing Business Manager",
    desc: "The bridge between our platform and our people. Ensuring seamless client relations and business coordination.",
    initials: "SK",
    accent: "#7b6fff",
  },
  {
    id: "priya",
    name: "Priya Rani",
    role: "Senior Agency Manager",
    desc: "The pillar of our client support. Managing communication and maintaining unbreakable trust with our community.",
    initials: "PR",
    accent: "#00c8ff",
  },
];

function TeamCard({ member, idx }: { member: typeof TEAM[0]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-10, 10]), { stiffness: 300, damping: 30 });
  const glowX = useTransform(mouseX, [-150, 150], [0, 100]);
  const glowY = useTransform(mouseY, [-150, 150], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.23, 1, 0.32, 1] }}
      className="snap-start shrink-0 w-[280px] sm:w-[340px] lg:w-[380px]"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative h-full flex flex-col rounded-[32px] border bg-[#050505] overflow-hidden cursor-default"
        animate={{
          borderColor: hovered ? `${member.accent}40` : "rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? `0 30px 80px rgba(0,0,0,0.8), 0 0 40px ${member.accent}25`
            : "0 10px 30px rgba(0,0,0,0.5)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Dynamic spotlight glow following mouse */}
        {hovered && (
          <motion.div
            className="absolute pointer-events-none z-10 w-[300px] h-[300px] rounded-full"
            style={{
              left: glowX.get() + "%",
              top: glowY.get() + "%",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${member.accent}20 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
        )}

        {/* Top shimmer line on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] z-20"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: `linear-gradient(90deg, transparent, ${member.accent}, #7b6fff, transparent)`, boxShadow: `0 0 12px ${member.accent}` }}
        />

        {/* Image Area */}
        <div className="relative h-[300px] sm:h-[360px] w-full bg-[#050505] flex items-stretch p-[10px] pb-0">

          {/* Straight centered line in top black gap */}
          <div
            className="absolute left-0 right-0 h-[1px] z-30 pointer-events-none"
            style={{
              top: "5px",
              background: `linear-gradient(90deg, transparent 0%, ${member.accent} 8%, ${member.accent} 92%, transparent 100%)`,
              boxShadow: `0 0 6px 1px ${member.accent}99`,
            }}
          />

          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            animate={{ opacity: hovered ? 1 : 0.4 }}
            transition={{ duration: 0.4 }}
            style={{ background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${member.accent}22 0%, transparent 70%)` }}
          />

          {member.image ? (
            <div className="relative w-full rounded-t-2xl overflow-hidden z-10"
              style={{ border: `1px solid ${member.accent}20`, borderBottom: "none" }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  style={{ filter: "saturate(1.1) contrast(1.05)", objectPosition: member.imgPosition ?? "center 10%" }}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[rgba(5,5,5,0.2)] to-transparent z-10" />
            </div>
          ) : (
            <div className="relative w-full rounded-t-2xl overflow-hidden z-10 flex flex-col items-center justify-center gap-5"
              style={{ border: `1px solid ${member.accent}20`, borderBottom: "none", background: "linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.04))" }}
            >
              <motion.div
                animate={{ scale: hovered ? 1.1 : 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black text-white border-2"
                style={{ borderColor: member.accent, background: `radial-gradient(circle, ${member.accent}33, transparent)` }}
              >
                {member.initials}
              </motion.div>
              <span className="text-[10px] uppercase tracking-widest text-[#A1A1AA] font-bold border border-[rgba(255,255,255,0.15)] px-4 py-1.5 rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-md">
                Privacy Respected
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 pb-8 pt-2 flex flex-col flex-grow relative z-20 -mt-20 sm:-mt-24">

          {/* Orb */}
          <motion.div
            className="absolute top-0 right-10 w-32 h-32 blur-[60px] pointer-events-none rounded-full"
            animate={{ opacity: hovered ? 0.35 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ background: member.accent }}
          />

          {/* Role Pill */}
          <div className="mb-5 self-start overflow-hidden relative">
            <span
              className="relative inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase border backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden"
              style={{ color: member.accent, backgroundColor: "rgba(0,0,0,0.5)", borderColor: `${member.accent}40` }}
            >
              {/* Shimmer */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              />
              <span className="relative z-10">{member.role}</span>
            </span>
          </div>

          <motion.h3
            className="text-2xl sm:text-[28px] font-black text-white mb-3 tracking-tight leading-none"
            animate={{ x: hovered ? 2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {member.name}
          </motion.h3>

          <p className="text-[13px] sm:text-[14px] text-[#A1A1AA] leading-relaxed mt-auto relative z-10 mb-6">
            {member.desc}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.05)]">
            <div style={{
              display: "flex", alignItems: "center", flexShrink: 0,
              padding: "3px 4px", gap: "1px", borderRadius: "13px",
              backdropFilter: "blur(28px) saturate(200%)",
              WebkitBackdropFilter: "blur(28px) saturate(200%)",
              background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: ["inset 0 1.5px 0 rgba(255,255,255,0.32)", "inset 0 -1px 0 rgba(0,0,0,0.18)", "0 0 22px rgba(77,163,255,0.14)", "0 4px 18px rgba(0,0,0,0.42)"].join(", "),
            }}>
              <a href="#" aria-label={`${member.name} on Instagram`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "8px", textDecoration: "none", transition: "all 0.2s ease", flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(225,48,108,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id={`ig-g-${member.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FCAF45"/><stop offset="40%" stopColor="#E1306C"/><stop offset="100%" stopColor="#C13584"/>
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke={`url(#ig-g-${member.id})`}/>
                  <circle cx="12" cy="12" r="4" stroke={`url(#ig-g-${member.id})`}/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C" stroke="none"/>
                </svg>
              </a>
              <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.12)", margin: "0 1px", flexShrink: 0 }} />
              <a href="#" aria-label={`${member.name} on Facebook`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "8px", textDecoration: "none", transition: "all 0.2s ease", flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(24,119,242,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" fill="#1877F2"/>
                </svg>
              </a>
            </div>
            <motion.a
              href={`/about#${member.id}`}
              className="flex items-center gap-2 text-[11px] sm:text-[12px] font-black tracking-widest uppercase"
              style={{ color: member.accent }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              Learn More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TeamSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 1.2 : clientWidth / 1.2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-10 pb-6 bg-[#000000] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgba(0,200,255,0.02)] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[rgba(123,111,255,0.02)] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[rgba(0,200,255,0.1)] to-[rgba(123,111,255,0.1)] border border-[rgba(0,200,255,0.2)] shadow-[0_0_20px_rgba(0,200,255,0.15)] backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-[#00c8ff] animate-pulse shadow-[0_0_8px_#00c8ff]" />
                <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-[#00c8ff] to-[#7b6fff] uppercase">
                  India’s Next-Level Fitness Transformation Team
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              The Architects Of Your <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00c8ff] to-[#7b6fff]">
                Transformation.
              </span>
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#A1A1AA] leading-relaxed max-w-lg">
              Behind every successful system is a team that refuses to settle for average. 
              Meet the top 1% minds building the future of fitness.
            </p>
          </motion.div>

          {/* Navigation Controls (Hidden on very small mobile to encourage swipe) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden sm:flex gap-3"
          >
            <button 
              onClick={() => scroll("left")}
              className="w-14 h-14 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(0,200,255,0.5)] transition-all duration-300 group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <ChevronLeft className="w-6 h-6 text-[#A1A1AA] group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-14 h-14 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(0,200,255,0.5)] transition-all duration-300 group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <ChevronRight className="w-6 h-6 text-[#A1A1AA] group-hover:text-white transition-colors" />
            </button>
          </motion.div>
        </div>

        {/* Slider Container with Mobile Bleed */}
        <div className="relative w-full -mx-4 sm:-mx-6 lg:mx-0 mt-8">
          <div 
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 lg:px-0 pb-16 pt-4 hide-scrollbar scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TEAM.map((member, idx) => (
              <TeamCard key={member.id} member={member} idx={idx} />
            ))}
          </div>
          
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            @keyframes teamFlowGlow {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            @keyframes teamFlowGlowV {
              0% { background-position: 0 -200%; }
              100% { background-position: 0 200%; }
            }
            .team-flow-v {
              background: linear-gradient(180deg, transparent, var(--accent), #7b6fff, transparent);
              background-size: 100% 200%;
              animation: teamFlowGlowV 3s infinite linear;
            }
            .team-flow-h {
              background: linear-gradient(90deg, transparent, var(--accent), #7b6fff, transparent);
              background-size: 200% 100%;
              animation: teamFlowGlow 3s infinite linear;
            }
            .team-card-glow-line {
              background: linear-gradient(90deg, transparent, #00c8ff, #7b6fff, transparent);
              background-size: 200% 100%;
              animation: teamFlowGlow 3s infinite linear;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
