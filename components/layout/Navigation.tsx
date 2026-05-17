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
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
            background: scrolled ? "rgba(255,255,255,0.065)" : "rgba(255,255,255,0.04)",
            border: scrolled ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.07)",
            boxShadow: scrolled
              ? [
                  "inset 0 1.5px 0 rgba(255,255,255,0.14)",
                  "inset 0 -1px 0 rgba(0,0,0,0.12)",
                  "0 0 40px rgba(77,163,255,0.14)",
                  "0 8px 32px rgba(0,0,0,0.45)",
                ].join(", ")
              : "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.3)",
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
              href="/get-started"
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

          {/* ── MOBILE RIGHT — unified control pill ── */}
          <div
            className="sl-mobile-right"
            style={{
              display: "none", alignItems: "center", flexShrink: 0,
              padding: "3px 4px", gap: "1px", borderRadius: "13px",
              backdropFilter: "blur(28px) saturate(200%)",
              WebkitBackdropFilter: "blur(28px) saturate(200%)",
              background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: [
                "inset 0 1.5px 0 rgba(255,255,255,0.32)",
                "inset 0 -1px 0 rgba(0,0,0,0.18)",
                "0 0 22px rgba(77,163,255,0.14)",
                "0 4px 18px rgba(0,0,0,0.42)",
              ].join(", "),
            }}
          >
            {/* Instagram */}
            <a
              href="#"
              aria-label="Sandy.Lifts on Instagram"
              className="sl-pill-btn sl-social-ig"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "8px", textDecoration: "none", transition: "all 0.2s ease", flexShrink: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <defs>
                  <linearGradient id="ig-g" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FCAF45"/>
                    <stop offset="40%" stopColor="#E1306C"/>
                    <stop offset="100%" stopColor="#C13584"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-g)"/>
                <circle cx="12" cy="12" r="4" stroke="url(#ig-g)"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C" stroke="none"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/916283752916?text=Hi%20Sandy.Lifts!%20I%20want%20to%20know%20more"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Sandy.Lifts on WhatsApp"
              className="sl-pill-btn sl-social-wa"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "8px", textDecoration: "none", transition: "all 0.2s ease", flexShrink: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Divider */}
            <div aria-hidden="true" style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.12)", margin: "0 1px", flexShrink: 0 }} />

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="sl-pill-btn sl-hamburger"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#D0D8E8", cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: "flex" }}>
                    <X size={14} />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: "flex" }}>
                    <Menu size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
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
          .sl-desktop-nav   { display: none !important; }
          .sl-mobile-right  { display: flex !important; }
        }
        @media (min-width: 768px) {
          .sl-desktop-nav   { display: flex !important; }
          .sl-mobile-right  { display: none !important; }
        }
        .sl-nav-item:hover { color: #F5F7FA !important; }
        .sl-nav-cta:hover {
          box-shadow: 0 0 36px rgba(77,163,255,0.9), 0 0 70px rgba(102,230,255,0.55), inset 0 1.5px 0 rgba(255,255,255,0.5) !important;
          transform: translateY(-1px) scale(1.04);
        }
        /* Pill buttons inside unified control strip */
        .sl-pill-btn { border-radius: 10px; }
        .sl-pill-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .sl-social-ig.sl-pill-btn:hover { background: rgba(225,48,108,0.15) !important; }
        .sl-social-wa.sl-pill-btn:hover { background: rgba(37,211,102,0.15) !important; }
        .sl-hamburger.sl-pill-btn:hover { background: rgba(77,163,255,0.15) !important; color: #F5F7FA !important; }

        /* Drawer nav item hover */
        .sl-drawer-item:hover {
          background: rgba(255,255,255,0.05) !important;
          color: #D0D8E8 !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        /* Drawer social pills */
        .sl-drawer-social:hover { opacity: 0.85; transform: translateY(-1px); }
        .sl-drawer-social.sl-social-ig:hover { background: rgba(193,53,132,0.16) !important; border-color: rgba(193,53,132,0.4) !important; }
        .sl-drawer-social.sl-social-yt:hover { background: rgba(255,0,0,0.16) !important; border-color: rgba(255,0,0,0.4) !important; }
        .sl-drawer-social.sl-social-wa:hover { background: rgba(37,211,102,0.16) !important; border-color: rgba(37,211,102,0.4) !important; }
        .sl-drawer-social.sl-social-fb:hover { background: rgba(24,119,242,0.16) !important; border-color: rgba(24,119,242,0.4) !important; }
      `}</style>

      {/* ═══════ MOBILE DRAWER ═══════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(5,5,11,0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            />

            <motion.div
              key="drawer"
              id="mobile-nav-menu"
              role="dialog" aria-modal="true" aria-label="Navigation menu"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", top: "68px", left: "12px", right: "12px", zIndex: 50,
                borderRadius: "20px", overflow: "hidden",
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(7,9,13,0.88) 40%, rgba(7,9,13,0.92) 100%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: [
                  "inset 0 1.5px 0 rgba(255,255,255,0.18)",
                  "inset 0 -1px 0 rgba(0,0,0,0.3)",
                  "0 0 0 1px rgba(0,0,0,0.3)",
                  "0 32px 64px rgba(0,0,0,0.7)",
                  "0 8px 24px rgba(0,0,0,0.5)",
                ].join(", "),
              }}
            >
              {/* Rainbow accent line at top */}
              <div aria-hidden="true" style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, #4DA3FF 20%, #A78BFA 50%, #66E6FF 80%, transparent 100%)", opacity: 0.7 }} />

              {/* Nav links */}
              <ul role="list" style={{ padding: "10px 10px 6px", margin: 0, listStyle: "none" }}>
                {NAV_LINKS.map(({ label, href, icon: Icon, badge }, i) => {
                  const active = isActive(href);
                  return (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2, ease: "easeOut" }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          position: "relative", overflow: "hidden",
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "11px 14px", borderRadius: "13px",
                          textDecoration: "none", fontSize: "0.95rem",
                          fontWeight: active ? 600 : 500,
                          color: active ? "#F5F7FA" : "#8A95A8",
                          background: active
                            ? "linear-gradient(135deg, rgba(77,163,255,0.12) 0%, rgba(102,230,255,0.05) 100%)"
                            : "transparent",
                          border: active ? "1px solid rgba(77,163,255,0.22)" : "1px solid transparent",
                          transition: "all 0.2s ease",
                          marginBottom: "2px",
                        }}
                        className="sl-drawer-item"
                      >
                        {/* Active left bar */}
                        {active && (
                          <span aria-hidden="true" style={{ position: "absolute", left: 0, top: "18%", bottom: "18%", width: "3px", borderRadius: "0 3px 3px 0", background: "linear-gradient(180deg, #4DA3FF, #66E6FF)", boxShadow: "0 0 8px rgba(77,163,255,0.9)", flexShrink: 0 }} />
                        )}
                        {/* Icon tile */}
                        <span style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: "32px", height: "32px", borderRadius: "9px", flexShrink: 0,
                          background: active
                            ? "linear-gradient(135deg, rgba(77,163,255,0.22), rgba(102,230,255,0.1))"
                            : "rgba(255,255,255,0.05)",
                          border: active ? "1px solid rgba(77,163,255,0.3)" : "1px solid rgba(255,255,255,0.07)",
                          boxShadow: active
                            ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 0 12px rgba(77,163,255,0.28)"
                            : "inset 0 1px 0 rgba(255,255,255,0.07)",
                          color: active ? "#4DA3FF" : "#4A5568",
                        }}>
                          <Icon size={14} />
                        </span>
                        <span style={{ flex: 1 }}>{label}</span>
                        {active && (
                          <span aria-hidden="true" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4DA3FF", boxShadow: "0 0 8px rgba(77,163,255,0.9)", flexShrink: 0 }} />
                        )}
                        {badge === "NEW" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "999px", fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, background: "rgba(167,139,250,0.12)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.32)", flexShrink: 0 }}>
                            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#A78BFA", display: "inline-block" }} />
                            NEW
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Divider */}
              <div aria-hidden="true" style={{ margin: "0 14px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

              {/* Footer — social + CTA */}
              <div style={{ padding: "12px 10px 14px", display: "flex", flexDirection: "column" as const, gap: "10px" }}>
                {/* Social row */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.28, duration: 0.2 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                >
                  <a
                    href="#"
                    aria-label="Sandy.Lifts on Instagram"
                    className="sl-drawer-social sl-social-ig"
                    style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", borderRadius: "10px", textDecoration: "none", fontSize: "0.78rem", fontWeight: 500, color: "#C13584", background: "rgba(193,53,132,0.08)", border: "1px solid rgba(193,53,132,0.2)", transition: "all 0.2s ease" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C"/>
                      <circle cx="12" cy="12" r="4" stroke="#E1306C"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/>
                    </svg>
                    Instagram
                  </a>
                  <a
                    href="#"
                    aria-label="Sandy.Lifts on YouTube"
                    className="sl-drawer-social sl-social-yt"
                    style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", borderRadius: "10px", textDecoration: "none", fontSize: "0.78rem", fontWeight: 500, color: "#FF4444", background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.2)", transition: "all 0.2s ease" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="1" y="5" width="22" height="14" rx="4" fill="#FF0000"/>
                      <polygon points="9.5 8.5 16 12 9.5 15.5" fill="white"/>
                    </svg>
                    YouTube
                  </a>
                  <a
                    href="https://wa.me/916283752916?text=Hi%20Sandy.Lifts!%20I%20want%20to%20know%20more"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with Sandy.Lifts on WhatsApp"
                    className="sl-drawer-social sl-social-wa"
                    style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", borderRadius: "10px", textDecoration: "none", fontSize: "0.78rem", fontWeight: 500, color: "#25D366", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", transition: "all 0.2s ease" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </motion.div>

                {/* Get Started CTA */}
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.2 }}>
                  <Link
                    href="/get-started"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      width: "100%", padding: "14px", borderRadius: "13px",
                      textDecoration: "none", fontSize: "0.92rem", fontWeight: 700, color: "#07090D",
                      background: "linear-gradient(135deg, #4DA3FF 0%, #66E6FF 60%, #4DA3FF 100%)",
                      border: "1px solid rgba(102,230,255,0.5)",
                      boxShadow: "0 0 28px rgba(77,163,255,0.55), inset 0 1.5px 0 rgba(255,255,255,0.5)",
                      position: "relative", overflow: "hidden",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)", animation: "shimmer 2.4s linear infinite", pointerEvents: "none" }} aria-hidden="true" />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <span style={{ position: "relative", zIndex: 1 }}>Start Your Transformation</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
