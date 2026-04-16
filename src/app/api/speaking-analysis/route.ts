import { NextResponse } from "next/server";
import { executeHeavyTask } from "@/services/aiService";
import { VSTEP_COACH_PROMPT } from "@/lib/vstep-prompt";

export async function POST(req: Request) {
  try {
    const { transcript, targetSentence } = await req.json();

    if (!transcript || !targetSentence) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `The user was supposed to read the following text aloud:
"${targetSentence}"

The speech-to-text engine heard:
"${transcript}"

Analyze their pronunciation. 
Identify words they likely mispronounced, skipped, or added.
Rate their overall pronunciation accuracy on a scale of 0 to 100.

Return ONLY a valid JSON object matching this structure:
{
  "accuracyScore": number (0-100),
  "feedback": "string (General encouraging feedback)",
  "mispronouncedWords": [
     {
       "word": "string (The target word)",
       "heardAs": "string (What it sounded like or 'skipped')",
       "tip": "string (How to pronounce it better)"
     }
  ]
}`;

    const systemInstruction = `${VSTEP_COACH_PROMPT}

ADDITIONAL EXAMINER INSTRUCTIONS:
You are an expert English speech pathologist API evaluating a user's speaking pronunciation. Output ONLY valid JSON.`;

    const text = await executeHeavyTask(prompt, systemInstruction, true);

    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    console.error("AI Service Error (speaking-analysis):", error);
    return NextResponse.json({ error: error.message || "Failed to analyze speech" }, { status: 500 });
  }
}
