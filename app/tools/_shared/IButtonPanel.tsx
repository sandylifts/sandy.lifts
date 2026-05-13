"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type StudyTag = "PRIMARY" | "COMPARED" | "SUPPORTING";

export interface Study {
  name:   string;
  detail: string;
  tag:    StudyTag;
}

interface IButtonPanelProps {
  why:        string;
  studies:    Study[];
  bottomLine: string;
  quote?:     string;
}

const TAG_STYLES: Record<StudyTag, string> = {
  PRIMARY:
    "bg-[rgba(195,252,254,0.12)] text-[#C3FCFE] border border-[rgba(195,252,254,0.3)]",
  COMPARED:
    "bg-[rgba(255,255,255,0.06)] text-[#9A9EC4] border border-[rgba(255,255,255,0.12)]",
  SUPPORTING:
    "bg-[rgba(167,139,250,0.12)] text-[#a78bfa] border border-[rgba(167,139,250,0.3)]",
};

interface IButtonTriggerProps {
  open:     boolean;
  onToggle: () => void;
}

/** Just the ⓘ trigger button — place this wherever you need it */
export function IButtonTrigger({ open, onToggle }: IButtonTriggerProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? "Close research panel" : "View research & methodology"}
      className={`w-8 h-8 rounded-full border text-[13px] italic font-serif flex items-center justify-center transition-all duration-200 shrink-0 ${
        open
          ? "border-[rgba(195,252,254,0.5)] text-[#C3FCFE] bg-[rgba(195,252,254,0.08)]"
          : "border-[rgba(255,255,255,0.12)] text-[#6B6F9A] hover:border-[rgba(195,252,254,0.4)] hover:text-[#C3FCFE]"
      }`}
    >
      i
    </button>
  );
}

/** The expandable research panel body — render this below your header row */
export function IButtonPanel({ why, studies, bottomLine, quote }: IButtonPanelProps) {
  return (
    <div className="mt-4 pt-4 border-t border-[rgba(195,252,254,0.08)]">
      <p className="text-[10px] font-semibold tracking-[2px] uppercase text-[#C3FCFE] mb-2">
        Why We Use This Method
      </p>
      <p className="text-[13px] text-[#9A9EC4] leading-[1.7] mb-5">{why}</p>

      <p className="text-[10px] font-semibold tracking-[2px] uppercase text-[#C3FCFE] mb-3">
        The Research
      </p>
      <div className="flex flex-col gap-3 mb-5">
        {studies.map((s, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#D8DBFC]">{s.name}</p>
              <p className="text-[11px] text-[#6B6F9A] mt-0.5 leading-relaxed">{s.detail}</p>
            </div>
            <span
              className={`shrink-0 text-[9px] font-semibold tracking-[1px] uppercase px-2 py-1 rounded-full ${TAG_STYLES[s.tag]}`}
            >
              {s.tag}
            </span>
          </div>
        ))}
      </div>

      {quote && (
        <div className="mb-5 pl-3 border-l-2 border-[rgba(195,252,254,0.25)]">
          <p className="text-[12px] italic text-[#6B6F9A] leading-[1.7]">{quote}</p>
        </div>
      )}

      <p className="text-[10px] font-semibold tracking-[2px] uppercase text-[#C3FCFE] mb-2">
        Bottom Line
      </p>
      <p className="text-[13px] italic text-[#9A9EC4] leading-[1.7]">{bottomLine}</p>
    </div>
  );
}

/**
 * Self-contained IButtonPanel with built-in toggle state.
 * Use this when the button and panel sit in the same layout column.
 * For full-width panel expansion, use IButtonTrigger + IButtonPanel separately.
 */
export function IButtonPanelSelfContained(props: IButtonPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <IButtonTrigger open={open} onToggle={() => setOpen((o) => !o)} />
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <IButtonPanel {...props} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
