"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroVisual() {
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check device dimensions
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    // Desktop Mouse Parallax Tracker
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 3D Angle Calculations for high-end floating effect on desktop
  const rotateX = !mounted || isMobile ? 0 : -mouse.y * 8;
  const rotateY = !mounted || isMobile ? 0 : mouse.x * 8;

  // Premium vertical frame styles: fully edge-to-edge on mobile
  const canvasStyle = {
    width: "100%",
    height: isMobile ? "450px" : "480px",
    borderRadius: isMobile ? "0px" : "28px",
    borderLeft: isMobile ? "none" : "1px solid rgba(255,255,255,0.08)",
    borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.08)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: isMobile ? "none" : "0 20px 40px rgba(0,0,0,0.75), 0 0 35px rgba(34,211,238,0.12), 0 0 65px rgba(168,85,247,0.08)",
    overflow: "hidden" as const,
    zIndex: 20,
    background: "#07090D",
    position: "relative" as const
  };

  return (
    <div className="flex flex-col items-center justify-center w-full select-none">
      
      {/* THE CANVAS PORTAL */}
      <div 
        className="relative flex items-center justify-center w-full lg:max-w-[420px] h-[450px] lg:h-[500px]"
        style={{ perspective: "1200px" }}
        aria-hidden="true"
      >
        {/* THE PERSPECTIVE CONTAINER */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: isMobile ? "none" : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* THE NEON PORTAL BACKLIGHT (Only desktop/tablet) */}
          {!isMobile && (
            <div 
              className="absolute w-[380px] h-[380px] rounded-full z-0 pointer-events-none"
              style={{
                transform: "translateZ(-60px)",
                border: "1px dashed rgba(34,211,238,0.1)",
                background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(168,85,247,0.05) 45%, transparent 70%)",
                boxShadow: "0 0 80px rgba(34,211,238,0.12), 0 0 120px rgba(168,85,247,0.05)",
                opacity: 0.8
              }}
            />
          )}

          {/* THE DYNAMIC CARD CONTAINER */}
          <div style={canvasStyle}>
            {/* Premium Foil reflection overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#22D3EE]/5 via-transparent to-[#A855F7]/5 z-20 pointer-events-none" />
            
            <Image
              src="/mobile-hero-pic.png"
              alt="Sandy Fitness Transformation"
              fill
              priority
              quality={100}
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "50% 25%",
                filter: "saturate(1.06) contrast(1.05) brightness(1.06)"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
