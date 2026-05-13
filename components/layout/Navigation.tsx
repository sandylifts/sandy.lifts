"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Home, Bot, Wrench, Users, Info, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",     href: "/",         icon: Home,   badge: null  },
  { label: "AI Coach", href: "/ai-coach", icon: Bot,    badge: "NEW" },
  { label: "Toolkit",  href: "/tools",    icon: Wrench, badge: null  },
  { label: "Why Join", href: "/about",    icon: Users,  badge: null  },
  { label: "About",    href: "/about",    icon: Info,   badge: null  },
] as const;

export function Navigation() {
  const pathname                    = usePathname();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Ref for the links container (NOT the whole nav) — so line is relative to it
  const linksRef  = useRef<HTMLDivElement>(null);
  const itemRefs  = useRef<(HTMLAnchorElement | null)[]>([]);

  // Spring-animated line
  const lineLeft  = useMotionValue(0);
  const lineWidth = useMotionValue(0);
  const springLeft  = useSpring(lineLeft,  { stiffness: 350, damping: 32 });
  const springWidth = useSpring(lineWidth, { stiffness: 350, damping: 32 });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Recompute line relative to linksRef container
  const moveLine = (el: HTMLAnchorElement | null) => {
    if (!el || !linksRef.current) return;
    const containerRect = linksRef.current.getBoundingClientRect();
    const elRect        = el.getBoundingClientRect();
    lineLeft.set(elRect.left - containerRect.left);
    lineWidth.set(elRect.width);
  };

  useEffect(() => {
    const idx = hoveredIdx !== null
      ? hoveredIdx
      : NAV_LINKS.findIndex(({ href }) => isActive(href));
    if (idx >= 0) moveLine(itemRefs.current[idx]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredIdx, pathname]);

  return (
    <>
      {/* ═══════ DESKTOP NAVBAR ═══════ */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", background: "transparent" }}>
        <nav
          aria-label="Main navigation"
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.05)",
            border: scrolled ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.05)",
            boxShadow: scrolled
              ? "0 0 30px rgba(77,163,255,0.12), inset 0 1px 0 rgba(77,163,255,0.08)"
              : "0 0 15px rgba(77,163,255,0.05)",
            transition: "all 0.4s ease",
          }}
        >
          {/* ── LOGO ── */}
          <Link href="/" aria-label="Sandy.Lifts home" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
            <span style={{ position: "relative", display: "inline-flex", alignItems: "flex-end", lineHeight: 1 }}>
              {/* SANDY — same gradient as "You're Not Alone" hero text */}
              <span style={{
                fontSize: "1.2rem",
                fontWeight: 900,
                letterSpacing: "0.04em",
                fontStyle: "italic",
                background: "linear-gradient(135deg, #4DA3FF 0%, #66E6FF 50%, #A78BFA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 8px rgba(77,163,255,0.7))",
              }}>SANDY</span>

              <span
                className="sl-logo-dot"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: "#66E6FF",
                  textShadow: "0 0 8px rgba(102,230,255,0.9), 0 0 16px rgba(77,163,255,0.7)",
                  animation: "dotBlink 1.8s ease-in-out infinite",
                  lineHeight: 1,
                }}>.</span>

              {/* LIFTS + dumbbell on top-right */}
              <span style={{ position: "relative", display: "inline-flex", alignItems: "flex-end" }}>
                <span style={{
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                  fontStyle: "italic",
                  color: "#F5F7FA",
                  textShadow: "0 0 10px rgba(255,255,255,0.35)",
                }}>LIFTS</span>

                {/* Dumbbell icon — top-right superscript position */}
                <span style={{ position: "absolute", top: "-10px", right: "-14px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="1"  y="9"  width="3"  height="6" rx="1.5" fill="#66E6FF"/>
                    <rect x="3.5" y="7" width="2.5" height="10" rx="1" fill="#66E6FF"/>
                    <rect x="6"  y="11" width="12" height="2" rx="1"   fill="#66E6FF" opacity="0.7"/>
                    <rect x="18" y="7"  width="2.5" height="10" rx="1" fill="#66E6FF"/>
                    <rect x="20" y="9"  width="3"  height="6" rx="1.5" fill="#66E6FF"/>
                  </svg>
                </span>
              </span>
            </span>
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div
            className="sl-desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "4px", position: "relative" }}
          >
            {/* Links container — line is measured relative to THIS */}
            <div
              ref={linksRef}
              style={{ display: "flex", alignItems: "center", gap: "4px", position: "relative" }}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* ── Magic sliding underline ── */}
              <motion.div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: springLeft,
                  width: springWidth,
                  height: "2px",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #4DA3FF, #66E6FF, #4DA3FF)",
                  boxShadow: "0 0 8px rgba(77,163,255,1), 0 0 20px rgba(102,230,255,0.7)",
                  pointerEvents: "none",
                }}
              />

              {NAV_LINKS.map(({ label, href, badge }, i) => {
                const active = isActive(href);
                return (
                  <Link
                    key={label}
                    href={href}
                    ref={(el) => { itemRefs.current[i] = el; }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 14px",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: active ? 600 : 500,
                      color: active ? "#F5F7FA" : "#AAB3C5",
                      transition: "color 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    className="sl-nav-item"
                  >
                    {label}
                    {badge === "NEW" && (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        fontSize: "0.52rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        border: "1px solid rgba(102,230,255,0.4)",
                        boxShadow: "0 0 10px rgba(77,163,255,0.3)",
                        background: "rgba(77,163,255,0.08)",
                      }}>
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#66E6FF", display: "inline-block", flexShrink: 0, boxShadow: "0 0 4px rgba(102,230,255,0.8)" }} />
                        <span className="sl-new-text">NEW</span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{ width: "1px", height: "20px", background: "rgba(77,163,255,0.15)", margin: "0 8px" }} aria-hidden="true" />

            {/* ── GET STARTED CTA ── */}
            <Link
              href="/tools"
              className="sl-nav-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#07090D",
                background: "linear-gradient(135deg, #4DA3FF 0%, #66E6FF 50%, #4DA3FF 100%)",
                backgroundSize: "200% 200%",
                border: "1px solid rgba(102,230,255,0.55)",
                boxShadow: "0 0 18px rgba(77,163,255,0.55), 0 0 40px rgba(102,230,255,0.22), inset 0 1px 0 rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                animation: "ctaGlow 2.5s ease-in-out infinite",
              }}
            >
              <span style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)",
                animation: "shimmer 2.2s linear infinite",
                pointerEvents: "none",
              }} aria-hidden="true" />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <span style={{ position: "relative", zIndex: 1 }}>Get Started</span>
              <span aria-hidden="true" style={{ position: "relative", zIndex: 1 }}>→</span>
            </Link>
          </div>

          {/* ── HAMBURGER ── */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ display: "none", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", background: "rgba(77,163,255,0.06)", border: "1px solid rgba(77,163,255,0.2)", color: "#AAB3C5", cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0 }}
            className="sl-hamburger"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: "flex" }}>
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: "flex" }}>
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </header>

      {/* ═══════ GLOBAL STYLES ═══════ */}
      <style>{`
        @keyframes dotBlink {
          0%, 100% { opacity: 1; text-shadow: 0 0 8px rgba(102,230,255,0.9), 0 0 16px rgba(77,163,255,0.7); }
          50%       { opacity: 0.25; text-shadow: none; }
        }
        .sl-new-text {
          background: linear-gradient(135deg, #4DA3FF 0%, #66E6FF 50%, #A78BFA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 0 18px rgba(77,163,255,0.55), 0 0 40px rgba(102,230,255,0.22), inset 0 1px 0 rgba(255,255,255,0.3); }
          50%       { box-shadow: 0 0 30px rgba(77,163,255,0.85), 0 0 60px rgba(102,230,255,0.45), inset 0 1px 0 rgba(255,255,255,0.3); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-180%); }
          100% { transform: translateX(280%); }
        }
        @media (max-width: 767px) {
          .sl-desktop-nav { display: none !important; }
          .sl-hamburger   { display: flex !important; }
        }
        @media (min-width: 768px) {
          .sl-desktop-nav { display: flex !important; }
          .sl-hamburger   { display: none !important; }
        }
        .sl-nav-item:hover { color: #F5F7FA !important; }
        .sl-nav-cta:hover {
          box-shadow: 0 0 36px rgba(77,163,255,0.9), 0 0 70px rgba(102,230,255,0.55), inset 0 1px 0 rgba(255,255,255,0.4) !important;
          transform: translateY(-1px) scale(1.04);
        }
        .sl-hamburger:hover {
          background: rgba(77,163,255,0.12) !important;
          border-color: rgba(77,163,255,0.4) !important;
          color: #F5F7FA !important;
        }
      `}</style>

      {/* ═══════ MOBILE DRAWER ═══════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(5,5,11,0.4)", backdropFilter: "blur(12px)" }}
            />

            <motion.div
              key="drawer"
              id="mobile-nav-menu"
              role="dialog" aria-modal="true" aria-label="Navigation menu"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ position: "fixed", top: "68px", left: "12px", right: "12px", zIndex: 50, borderRadius: "16px", overflow: "hidden", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 40px rgba(0,0,0,0.5)" }}
            >
              <ul role="list" style={{ padding: "8px", margin: 0, listStyle: "none" }}>
                {NAV_LINKS.map(({ label, href, icon: Icon, badge }, i) => {
                  const active = isActive(href);
                  return (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.18 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, color: active ? "#F5F7FA" : "#AAB3C5", background: active ? "rgba(77,163,255,0.08)" : "transparent", border: active ? "1px solid rgba(77,163,255,0.2)" : "1px solid transparent", transition: "all 0.2s ease", marginBottom: "2px" }}
                      >
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "8px", background: active ? "rgba(77,163,255,0.15)" : "rgba(255,255,255,0.04)", color: active ? "#4DA3FF" : "#6B7280", flexShrink: 0 }}>
                          <Icon size={14} />
                        </span>
                        <span style={{ flex: 1 }}>{label}</span>
                        {active && <span aria-hidden="true" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4DA3FF", boxShadow: "0 0 6px rgba(77,163,255,0.8)", flexShrink: 0 }} />}
                        {badge === "NEW" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 7px", borderRadius: "999px", fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: "rgba(167,139,250,0.12)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.35)", flexShrink: 0 }}>
                            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#A78BFA", display: "inline-block" }} />
                            NEW
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div style={{ padding: "8px 12px 16px" }}>
                <Link
                  href="/tools"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px", borderRadius: "12px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, color: "#07090D", background: "linear-gradient(135deg, #4DA3FF, #66E6FF)", border: "1px solid rgba(102,230,255,0.5)", boxShadow: "0 0 24px rgba(77,163,255,0.6)", transition: "all 0.2s ease" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <span>Get Started</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
