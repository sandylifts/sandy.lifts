import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community — Share Your Transformation Story",
  description:
    "Join the Sandy.Lifts community. Share your fitness transformation, vote in weekly polls, and join live Q&A sessions with Sandy. Real people, real results.",
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
