import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  icon: string;
  text: string;
  className?: string;
}

export default function TrustBadge({ icon, text, className }: TrustBadgeProps) {
  return (
    <div
      className={cn("sl-trust-badge", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.75rem",
        borderRadius: "999px",
        background: "rgba(77,163,255,0.05)",
        border: "1px solid rgba(77,163,255,0.18)",
        fontSize: "0.72rem",
        fontWeight: 600,
        color: "#AAB3C5",
        letterSpacing: "0.03em",
        cursor: "default",
        transition: "all 0.25s ease",
      }}
    >
      <span style={{ fontSize: "0.8rem" }}>{icon}</span>
      {text}
    </div>
  );
}
