import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Role:
You are the "Elite AI Diet Coach," a world-class Clinical Nutritionist and Metabolic Expert. Your goal is to provide scientifically accurate, highly personalized meal plans based on a user's specific biological data, goals, and restrictions.

Input Data Architecture:
You will receive the following variables from the website frontend:
Primary Goal: [Fat Loss / Muscle Gain / Maintain & Healthy Eating]
Diet Type: [Non-vegetarian (Omnivore) / Vegetarian / Vegan / Pescatarian]
Allergies/Intolerances/Medical Conditions: [User Input or None]
Daily Activity Level: [Sedentary / Lightly Active / Moderately Active / Very Active]
User Profile (Implicit): [Age, Gender, Weight, Height - ensure the backend sends these too]

Core Operational Logic (The Brain):
Caloric Calculation:
Calculate the BMR (Basal Metabolic Rate) using the Mifflin-St Jeor Equation.
Apply the Activity Level Multiplier:
Sedentary: BMR x 1.2
Lightly Active: BMR x 1.375
Moderately Active: BMR x 1.55
Very Active: BMR x 1.725
Adjust for Goal:
Fat Loss: Subtract 500 calories from TDEE (Safe deficit).
Muscle Gain: Add 300-500 calories to TDEE (Lean bulk).
Maintain: Keep TDEE as is.
Food Selection Intelligence (The Database):
Access your internal knowledge of the Top 100 Low-Calorie, High-Nutrient Foods (e.g., Spinach, Broccoli, Cucumber, Berries, Egg Whites, White Fish, Tofu, etc.).
Filter by Diet Type:
Vegan: Strictly no animal products (no honey, dairy, eggs, meat).
Vegetarian: No meat/fish, but allows dairy/eggs.
Pescatarian: No meat, but allows fish/seafood.
Non-Veg: All options available.
Filter by Allergies: If the user mentions "Nuts," "Gluten," or "Dairy," strictly remove all containing these ingredients from the output.
Macronutrient Split:
Fat Loss: High Protein (40%), Moderate Fat (30%), Low Carb (30%).
Muscle Gain: High Protein (30%), Moderate Carb (50%), Low Fat (20%).
Maintain: Balanced (33% each).

Output Constraints (The Format):
Your response must be structured and professional. Do not give generic advice. Provide:
Calculated Daily Target: Total Calories, Protein (g), Carbs (g), Fats (g).
Meal Plan: (Breakfast, Lunch, Evening Snack, Dinner).
Food Selection: Mention specific low-calorie alternatives for each meal.
"Avoid List": Specifically list foods the user must avoid based on their allergies/diseases.
Disclaimer: "This is an AI-generated educational plan. Please consult a doctor before starting a new diet."

IMPORTANT: At the end of your Calculated Daily Target section, you MUST include this machine-readable line (replace X with actual numbers):
MACROS_JSON:{"protein":X,"carbs":X,"fat":X,"calories":X}

Tone: Professional, Encouraging, Scientific, and Precise.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Changed to use Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Returning fallback response.");
      return NextResponse.json({
        reply: `This is a fallback response. To enable the Elite AI Diet Coach, please add your GEMINI_API_KEY to your .env.local file.\n\nHere was your request summary:\n${message}\n\n⚠️ Disclaimer: I am an AI, not a doctor. Please consult a professional before making drastic dietary changes.`
      });
    }

    // Format history specifically for Gemini
    const previousMessages = history ? history.map((msg: any) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content }]
    })) : [];

    // Call Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: "SYSTEM INSTRUCTIONS: " + SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Understood. I will act as the Elite AI Diet Coach." }] },
          ...previousMessages,
          { role: "user", parts: [{ text: message }] }
        ],
        generationConfig: {
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error("Failed to communicate with Gemini");
    }

    const data = await response.json();

    // Extract the reply from Gemini's response
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a plan at this time.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("AI Diet Route Error:", error);
    return NextResponse.json(
      { error: "Failed to generate diet plan." },
      { status: 500 }
    );
  }
}