import { NextResponse } from "next/server";
import { executeHeavyTask } from "@/services/aiService";
import { speakingFeedbackPrompt } from "@/lib/vstep-prompt";

export async function POST(req: Request) {
  try {
    const { audioUrl, transcript, prompt } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const aiPrompt = `
Evaluate the candidate's speaking response strictly based on the VSTEP criteria.

PROMPT / SITUATION:
${prompt || "Unknown"}

CANDIDATE TRANSCRIPT:
${transcript}`;

    // executeHeavyTask with isJson parameter = true
    const text = await executeHeavyTask(aiPrompt, speakingFeedbackPrompt, true);
    
    // Safety generic parsing check since sometimes models return codeblocks
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanText);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Service Error (speaking-feedback):", error);
    
    if (error.message && error.message.includes("AI_FALLBACK_TRIGGERED")) {
      return NextResponse.json({
        status: "fallback",
        message: "AI scoring service is temporarily unavailable due to capacity limits. Please try again later."
      });
    }

    return NextResponse.json({ error: error.message || "Failed to analyze speaking" }, { status: 500 });
  }
}
