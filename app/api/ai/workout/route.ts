import { NextResponse } from "next/server";

const WORKOUT_SYSTEM_PROMPT = `Role:
You are "Elite AI Workout Coach," a certified Strength & Conditioning Specialist (CSCS) and Sports Scientist at Sandy.Lifts. You design evidence-based, periodised weekly workout plans tailored to the user's exact goal, equipment access, and fitness level.

Input Architecture:
- Primary Goal: [Fat Loss / Hypertrophy / Strength / Athletic Performance / General Fitness]
- Training Style: [Home Workout / Gym / Calisthenics / Mixed]
- Experience Level: [Beginner / Intermediate / Advanced]
- Days Per Week: [3 / 4 / 5 / 6]
- Focus Area: [Full Body / Upper/Lower Split / Push Pull Legs / Bro Split]
- Injuries / Limitations: [User Input or None]

Core Operational Logic:
1. Program Design: Use scientifically validated periodisation (linear, undulating, or block).
2. Volume: Prescribe sets × reps × rest based on goal (hypertrophy: 3-4×8-12, strength: 4-6×3-6, fat loss: circuit/AMRAP style).
3. Exercise Selection: Compound first, isolation second. Include warm-up and cool-down.
4. Progressive Overload: Include weekly progression tips (add 2.5kg/week on compounds, add 1 rep per set on isolation).

Output Format (STRICT):
Provide a structured 7-day weekly plan in this format:
📅 WEEKLY PLAN — [GOAL] | [STYLE]
---
Day 1 — [Muscle Group]: 
  • Exercise: Sets × Reps | Rest
Day 2 — REST / Active Recovery
...

Then include:
📊 MACRO TARGETS FOR [GOAL]:
Protein: Xg | Carbs: Xg | Fat: Xg | Calories: X kcal
MACROS_JSON:{"protein":X,"carbs":X,"fat":X,"calories":X}

Then include:
💡 PROGRESSIVE OVERLOAD TIP: [specific weekly progression advice]
⚠️ Disclaimer: This is an AI-generated educational plan. Consult a certified trainer before starting.
Tone: Motivating, precise, science-backed. Never vague.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: `**FALLBACK WORKOUT PLAN** (Demo mode — add GEMINI_API_KEY to enable live AI)\n\n📅 WEEKLY PLAN — Fat Loss | Gym\n---\nDay 1 — Push (Chest/Shoulders/Triceps):\n  • Bench Press: 4×8 | 90s rest\n  • Overhead Press: 3×10 | 75s rest\n  • Tricep Pushdown: 3×12 | 60s rest\n\nDay 2 — Pull (Back/Biceps):\n  • Pull-ups: 4×8 | 90s rest\n  • Barbell Row: 4×8 | 90s\n  • Face Pulls: 3×15 | 60s\n\nDay 3 — REST / Walk 30 min\n\nDay 4 — Legs:\n  • Squat: 4×8 | 2min rest\n  • Romanian Deadlift: 3×10 | 90s\n  • Leg Press: 3×12 | 75s\n\nDay 5 — Full Body Circuit (Fat Burn)\n  • Burpees × 15 | DB Thrusters × 12 | Box Jumps × 10 — 4 rounds\n\nDay 6-7 — REST\n\n📊 MACRO TARGETS:\nProtein: 160g | Carbs: 180g | Fat: 55g | Calories: 1850\nMACROS_JSON:{"protein":160,"carbs":180,"fat":55,"calories":1850}\n\n⚠️ Educational only. Consult a trainer.`
      });
    }

    const previousMessages = history ? history.map((msg: { role: string; content: string }) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content }]
    })) : [];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: "SYSTEM INSTRUCTIONS: " + WORKOUT_SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Understood. I will act as the Elite AI Workout Coach at Sandy.Lifts." }] },
            ...previousMessages,
            { role: "user", parts: [{ text: message }] }
          ],
          generationConfig: { temperature: 0.7 }
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Gemini Workout API Error:", err);
      throw new Error("Gemini API failed");
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || "I couldn't generate a workout plan right now. Please try again.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Workout Route Error:", error);
    return NextResponse.json({ error: "Failed to generate workout plan." }, { status: 500 });
  }
}
