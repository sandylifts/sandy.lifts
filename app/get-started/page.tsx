import type { Metadata } from "next";
import { GetStartedJourney } from "@/components/get-started/GetStartedJourney";

export const metadata: Metadata = {
  title: "Get Started — Build Your Plan",
  description: "Answer 4 questions. Get a personalized 180-day fitness plan built for your body, your goal, and your level.",
};

export default function GetStartedPage() {
  return <GetStartedJourney />;
}
