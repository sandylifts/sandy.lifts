import { cn } from "@/lib/utils";
import React from "react";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary:
    "rounded-[14px] bg-gradient-to-br from-[rgba(77,163,255,0.2)] to-[rgba(167,139,250,0.2)] border border-[rgba(77,163,255,0.5)] text-[#66E6FF] hover:bg-[rgba(77,163,255,0.35)] hover:shadow-[0_0_40px_rgba(77,163,255,0.35)] hover:-translate-y-0.5",
  ghost:
    "rounded-[10px] bg-transparent border-none text-[#9A9EC4] hover:bg-[rgba(77,163,255,0.06)] hover:text-[#D8DBFC]",
  outline:
    "rounded-[12px] bg-transparent border border-[rgba(77,163,255,0.2)] text-[#9A9EC4] hover:border-[rgba(77,163,255,0.4)] hover:text-[#D8DBFC] hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-[1.75rem] py-3 text-[0.95rem]",
  lg: "px-8 py-4 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
