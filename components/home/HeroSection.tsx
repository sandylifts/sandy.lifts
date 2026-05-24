"use client";
import { useEffect, useState } from "react";
import ParticleField from "./particle-field";
import HeroVisual from "../features/hero/HeroVisual";

import { HeroHeading } from "./HeroHeading";
import { ProblemSlider } from "./ProblemSlider";
import { CTASection } from "./CTASection";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      aria-label="Hero section"
      className="relative flex flex-col min-h-[100svh] overflow-hidden bg-[#07090D] lg:bg-[url('/cover.bg.png')] lg:bg-cover lg:bg-right lg:bg-no-repeat"
    >
      {mounted && <ParticleField />}

      {/* Background gradient */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(77,163,255,.1) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 85% 80%, rgba(167,139,250,.07) 0%, transparent 55%)" }} />

      {/* Digital mesh grid */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none lg:opacity-40" style={{ backgroundImage: "linear-gradient(rgba(77,163,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(77,163,255,.02) 1px,transparent 1px)", backgroundSize: "64px 64px", mask: "radial-gradient(ellipse 90% 90% at 50% 50%,black 25%,transparent 100%)", WebkitMask: "radial-gradient(ellipse 90% 90% at 50% 50%,black 25%,transparent 100%)" }} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10 w-full max-w-[1340px] mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">
          
          {/* LEFT: Heading, Slider, CTA, Icons */}
          <div className="flex-1 flex flex-col w-full text-center lg:text-left items-center lg:items-start max-w-2xl lg:max-w-[580px] xl:max-w-[620px] z-20">
            <HeroHeading />
            <div className="w-full mt-10 mb-2">
              <ProblemSlider />
            </div>
            <CTASection />
          </div>

          {/* RIGHT: Photo - Only visible on mobile/tablet, hidden on desktop since the desktop background has the image! */}
          <div className="flex lg:hidden flex-1 items-center justify-center w-full relative z-10 mt-12 -mx-6 w-[calc(100%+3rem)]">
            <HeroVisual />
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-20 flex justify-center pb-8">
        <div
          className="flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity group"
          onClick={() => document.getElementById("stats-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="text-[0.68rem] text-[#AAB3C5] tracking-[0.1em] uppercase">Scroll to Explore</span>
          <div className="group-hover:animate-bounce mt-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4DA3FF" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
      </div>
    </section>
  );
}
