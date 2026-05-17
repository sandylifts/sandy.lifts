"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const TOOLS = [
  { label: "Macro Calculator", href: "/tools/macro-calculator" },
  { label: "Body Type Quiz", href: "/tools/body-type-quiz" },
  { label: "Body Fat %", href: "/tools/body-fat" },
  { label: "Protein Target", href: "/tools/protein-target" },
  { label: "Calorie Deficit", href: "/tools/calorie-deficit" },
  { label: "Water Intake", href: "/tools/water-intake" },
];

const EXPLORE = [
  { label: "AI Coach", href: "/ai-coach" },
  { label: "Get Started", href: "/get-started" },
  { label: "Toolkit", href: "/tools" },
  { label: "About Sandy", href: "/about" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/oye_vilen01/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="footer-ig" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCAF45"/>
            <stop offset="40%" stopColor="#E1306C"/>
            <stop offset="100%" stopColor="#C13584"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#footer-ig)"/>
        <circle cx="12" cy="12" r="4" stroke="url(#footer-ig)"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C" stroke="none"/>
      </svg>
    ),
    hoverBg: "rgba(225,48,108,0.12)",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/916283752916?text=Hi%20Sandy.Lifts!%20I%20want%20to%20know%20more",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    hoverBg: "rgba(37,211,102,0.12)",
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF4444">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    hoverBg: "rgba(255,68,68,0.12)",
  },
];

export function Footer() {
  return (
    <footer className="relative w-full bg-[#000000] overflow-hidden">
      <style>{`
        .footer-link {
          display: block;
          font-size: 13px;
          color: #8B909E;
          text-decoration: none;
          padding: 5px 0;
          transition: color 0.2s ease;
          font-weight: 500;
        }
        .footer-link:hover { color: #F5F7FA; }
        .footer-social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: all 0.2s ease; cursor: pointer; text-decoration: none;
        }
        .footer-social-btn:hover { border-color: rgba(255,255,255,0.16); transform: translateY(-2px); }
      `}</style>

      {/* Top rainbow divider */}
      <div className="w-full h-[1px]" style={{ background: "linear-gradient(90deg, transparent 0%, #4DA3FF 20%, #A78BFA 50%, #66E6FF 80%, transparent 100%)", opacity: 0.5 }} />

      {/* Big CTA strip */}
      <div className="relative border-b border-[rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(77,163,255,0.06) 0%, transparent 70%)" }} />
        <div className="max-w-[1280px] mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] font-bold tracking-[0.25em] text-[#4DA3FF] uppercase mb-3"
            >
              Ready to transform?
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-black text-white leading-tight"
              style={{ fontSize: "clamp(22px, 3.5vw, 38px)" }}
            >
              Your 1% journey{" "}
              <span style={{ background: "linear-gradient(90deg, #4DA3FF, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                starts today.
              </span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Link
              href="/get-started"
              className="relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-[#07090D] text-[0.95rem] overflow-hidden"
              style={{ background: "linear-gradient(90deg, #4DA3FF, #66E6FF)", boxShadow: "0 0 30px rgba(77,163,255,0.3)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              Start Your Transformation
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-[1280px] mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Logo + Name inline */}
            <Link href="/" className="flex items-center gap-3 mb-5" style={{ textDecoration: "none" }}>
              <div className="relative w-[52px] h-[52px] shrink-0" style={{ filter: "drop-shadow(0 0 14px rgba(167,139,250,0.4))" }}>
                <Image
                  src="/sandy-lifts-logo.jpg"
                  alt="Sandy.Lifts"
                  fill
                  sizes="52px"
                  style={{ objectFit: "contain", borderRadius: "12px" }}
                />
              </div>
              <span style={{ fontWeight: 900, fontSize: "1.2rem", background: "linear-gradient(135deg, #4DA3FF, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Sandy.Lifts
              </span>
            </Link>

            {/* Vision statement */}
            <p className="text-[9px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: "#A78BFA" }}>
              Our Vision
            </p>
            <p className="text-[15px] font-black text-white leading-snug mb-3">
              Not a plan. A lifestyle.
            </p>
            <p className="text-[13px] leading-[1.75] mb-6" style={{ color: "#8B909E", maxWidth: "215px" }}>
              We help you capture your best version — simple meals, smart training, zero extra tasks. Not a temporary habit. Your peak, permanently.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="footer-social-btn"
                  onMouseEnter={e => (e.currentTarget.style.background = s.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-[11px] font-black tracking-[0.2em] uppercase mb-5" style={{ color: "#4DA3FF" }}>Tools Hub</h4>
            {TOOLS.map(t => (
              <Link key={t.href} href={t.href} className="footer-link">{t.label}</Link>
            ))}
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[11px] font-black tracking-[0.2em] uppercase mb-5" style={{ color: "#A78BFA" }}>Explore</h4>
            {EXPLORE.map(e => (
              <Link key={e.href} href={e.href} className="footer-link">{e.label}</Link>
            ))}
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-[11px] font-black tracking-[0.2em] uppercase mb-5" style={{ color: "#52525B" }}>Disclaimer</h4>
            <p className="text-[12px] leading-[1.8]" style={{ color: "#6B7280" }}>
              All content is for educational purposes only. Always consult a qualified healthcare professional before starting any fitness or diet programme.
            </p>
            <p className="text-[12px] leading-[1.8] mt-3" style={{ color: "#6B7280" }}>
              AI tools on this site do not provide medical advice or diagnosis.
            </p>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="w-full h-[1px] mb-7" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px]" style={{ color: "#6B7280" }}>
            © {new Date().getFullYear()} Sandy.Lifts. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "#6B7280" }}>
            <span>Made with</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#A78BFA" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            <span>for the fitness community</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="footer-link" style={{ padding: 0, fontSize: "12px" }}>Privacy</Link>
            <Link href="#" className="footer-link" style={{ padding: 0, fontSize: "12px" }}>Terms</Link>
          </div>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center bottom, rgba(77,163,255,0.04) 0%, transparent 70%)" }} />
    </footer>
  );
}
