"use client";

interface TipCardProps {
  icon: string;
  tip: string;
  source?: string;
  rank: number; // 1 = highest priority
}

export function TipCard({ icon, tip, source, rank }: TipCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-4 transition-all duration-200 hover:border-[rgba(195,252,254,0.2)] hover:bg-[rgba(195,252,254,0.03)]">
      <div className="shrink-0 w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[16px]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-[#D8DBFC] leading-[1.65]">{tip}</p>
        {source && (
          <p className="text-[11px] text-[#6B6F9A] mt-1 italic">{source}</p>
        )}
      </div>
      {rank === 1 && (
        <span className="shrink-0 text-[9px] font-bold tracking-[1px] uppercase px-2 py-1 rounded-full bg-[rgba(167,139,250,0.12)] text-[#a78bfa] border border-[rgba(167,139,250,0.3)]">
          TOP GAIN
        </span>
      )}
    </div>
  );
}
