import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Strict isolation of context variables based on our strategy
    const { 
      gender = 'Not specified',
      goal = 'Not specified', 
      age = 'Not specified',
      height = 'Not specified',
      weight = 'Not specified',
      bodyType = 'Not specified',
      conditions = [],
      injuries = 'No',
      sleep = 'Not specified',
      dietType = 'Not specified',
      stress = 'Not specified',
      activity = 'Not specified',
      level = 'Not specified',
      pathType = 'both',
      trainingSetup = 'Not specified',
      exerciseFormat = 'Not specified',
      history = [],
      prompt = ''
    } = body;

    const medConditions = conditions.length > 0 ? conditions.join(', ') : 'None';

    // Constructing a structured profile string
    const userDataStr = `
    Gender: ${gender}
    Age: ${age}
    Height: ${height} cm
    Weight: ${weight} kg
    Body Type: ${bodyType}
    Goal: ${goal}
    Current Activity/Experience Level: ${pathType === 'workout' || pathType === 'both' ? level : activity}
    Exercise Format: ${exerciseFormat}
    Training Location: ${trainingSetup}
    Diet Preference: ${pathType === 'workout' ? 'N/A' : dietType}
    Sleep: ${sleep} hours/night
    Stress Level: ${stress}/10
    Medical Conditions: ${medConditions}
    Injuries/Pain: ${injuries}
    Requested Plan Type: ${pathType.toUpperCase()} (workout / diet / both)
    `;

    const systemPrompt = `You are a strict, top 1% elite fitness coach. You are NOT a doctor. You will ONLY use the user's selected variables to create a personalized plan based on their "Requested Plan Type". If "WORKOUT", provide ONLY a workout split. If "DIET", provide ONLY a diet macro structure and meals. If "BOTH", provide both. Do NOT prescribe medications. Do NOT mix male and female advice. If the user has a medical condition like PCOD or Thyroid, do not provide medical advice for it; just provide the exercise volume and calorie count appropriate for their goal considering the condition. Ensure the tone is premium, professional, and highly motivational. Respond in clean Markdown format.`;

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Please create a premium plan for the following profile:\n${userDataStr}`
      }
    ];

    if (history && history.length > 0) {
      messages.push(...history);
    }
    
    if (prompt) {
      messages.push({ role: "user", content: prompt });
    }

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama-3.3-70b-versatile", // Llama 3.3 70B — premium quality, still free on Groq
      temperature: 0.7,
      max_tokens: 2048,
    });

    const responseContent = completion.choices[0]?.message?.content;

    return NextResponse.json({ 
      success: true, 
      data: responseContent 
    });

  } catch (error: any) {
    console.error("Groq API Error:", error);
    
    // Smart Retry System: Handling Rate Limit
    if (error?.status === 429) {
      return NextResponse.json({ 
        success: false, 
        error: "rate_limit_exceeded",
        message: "Our AI is currently analyzing a high volume of profiles. Please wait 10 seconds..." 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      success: false, 
      error: "server_error",
      message: error?.message || error?.toString() || "An error occurred while generating the plan." 
    }, { status: 500 });
  }
}
