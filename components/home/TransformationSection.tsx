"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

const TRANSFORMATIONS = [
  {
    name: "Client S.",
    beforeWeight: "96.8 kg",
    afterWeight: "90 kg",
    lost: "6.8 KG",
    duration: "First Month",
    beforeImg: "/TRANSFORMATONS/client1-before.jpg",
    afterImg: "/TRANSFORMATONS/client1-after.jpg",
    quote: "Ghar pe rehke bhi results mile — koi gym nahi, sirf system.",
  },
];

export function TransformationSection() {
  return (
    <section className="relative w-full pt-16 pb-24 bg-[#000000] overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .sl-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          animation: shimmer 2.5s infinite;
        }
      `}</style>

      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[rgba(77,163,255,0.06)] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[rgba(168,85,247,0.05)] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-4"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#4DA3FF]" />
            <span className="text-[9px] font-bold tracking-[0.25em] text-[#4DA3FF] uppercase">Real People. Real Results.</span>
            <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#4DA3FF]" />
          </div>

          <h2
            className="font-bold text-center leading-[1.1] mb-4"
            style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
          >
            <span className="text-white">Proof That The </span>
            <span
              style={{
                background: "linear-gradient(90deg, #4DA3FF 0%, #A78BFA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              System Works.
            </span>
          </h2>

          <p className="text-[#A1A1AA] text-[13px] text-center max-w-[420px] leading-relaxed">
            No filter. No surgery. No shortcuts. Sirf system aur discipline.
          </p>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-2 bg-[rgba(77,163,255,0.08)] border border-[rgba(77,163,255,0.2)] rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4DA3FF] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-[#4DA3FF] uppercase">Verified Transformation · No Filter</span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-8 items-center">
          {TRANSFORMATIONS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="w-full max-w-[860px]"
            >
              <div
                className="relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)]"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(7,9,13,0.95) 100%)",
                  boxShadow: "0 0 60px rgba(77,163,255,0.08), 0 32px 64px rgba(0,0,0,0.5)",
                }}
              >
                {/* Interactive Before / After Slider */}
                <BeforeAfterSlider 
                  beforeImg={t.beforeImg} 
                  afterImg={t.afterImg} 
                  beforeWeight={t.beforeWeight}
                  afterWeight={t.afterWeight}
                />
                {/* Stats Bar */}
                <div
                  className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.07)]"
                  style={{ background: "rgba(7,9,13,0.95)" }}
                >
                  {/* Left: stats */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex flex-col">
                      <span
                        className="text-[28px] font-black leading-none"
                        style={{
                          background: "linear-gradient(90deg, #4DA3FF, #A78BFA)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {t.lost}
                      </span>
                      <span className="text-[10px] text-[#52525B] font-bold uppercase tracking-wider mt-0.5">Lost</span>
                    </div>
                    <div className="w-[1px] h-10 bg-[rgba(255,255,255,0.07)]" />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-white">{t.duration}</span>
                      <span className="text-[10px] text-[#52525B] font-bold uppercase tracking-wider mt-0.5">Timeline</span>
                    </div>
                    <div className="w-[1px] h-10 bg-[rgba(255,255,255,0.07)]" />
                    <div className="flex flex-col max-w-[200px]">
                      <span className="text-[12px] text-[#A1A1AA] italic leading-snug">"{t.quote}"</span>
                      <span className="text-[10px] text-[#52525B] font-bold uppercase tracking-wider mt-1">— {t.name}</span>
                    </div>
                  </div>

                  {/* Right: Sandy.Lifts watermark */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="text-[13px] font-black tracking-wide"
                      style={{
                        background: "linear-gradient(90deg, #4DA3FF, #66E6FF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Sandy.Lifts
                    </span>
                    <span className="text-[10px] text-[#3F3F46]">✓ Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center mt-14 gap-4"
        >
          <p className="text-[13px] text-[#52525B] text-center">Teri transformation next ho sakti hai.</p>
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[1rem] text-[#07090D]"
            style={{
              background: "linear-gradient(90deg, #4DA3FF, #66E6FF)",
              boxShadow: "0 0 30px rgba(77,163,255,0.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            Start Your Transformation
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
