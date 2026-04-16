import { NextResponse } from "next/server";
import { executeHeavyTask } from "@/services/aiService";
import { writingFeedbackPrompt } from "@/lib/vstep-prompt";

export async function POST(req: Request) {
  try {
    const { essay, prompt } = await req.json();

    if (!essay) {
      return NextResponse.json({ error: "Essay is required" }, { status: 400 });
    }

    const aiPrompt = `
Evaluate the candidate's writing response strictly based on the VSTEP criteria.

PROMPT / TASK:
${prompt || "Unknown"}

CANDIDATE ESSAY:
${essay}`;

    const text = await executeHeavyTask(aiPrompt, writingFeedbackPrompt, true);
    
    // Safety JSON extraction
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanText);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Service Error (writing-feedback):", error);
    
    if (error.message && error.message.includes("AI_FALLBACK_TRIGGERED")) {
      return NextResponse.json({
        status: "fallback",
        message: "AI scoring service is temporarily unavailable due to capacity limits. Please try again later."
      });
    }

    return NextResponse.json({ error: error.message || "Failed to analyze writing" }, { status: 500 });
  }
}
