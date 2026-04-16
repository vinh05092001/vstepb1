import { NextResponse } from "next/server";
import { executeLightweightTask } from "@/services/aiService";
import { vocabularyPrompt } from "@/lib/vstep-prompt";

export async function POST(req: Request) {
  try {
    const { word } = await req.json();

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const aiPrompt = `Task: Generate a VSTEP B1 vocabulary card for the word/phrase: "${word}"`;

    const text = await executeLightweightTask(aiPrompt, vocabularyPrompt, true);
    
    // Safety JSON extraction
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanText);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Service Error (vocab-generator):", error);
    
    if (error.message && error.message.includes("AI_FALLBACK_TRIGGERED")) {
      return NextResponse.json({
        status: "fallback",
        message: "AI vocabulary service is temporarily unavailable due to capacity limits. Please try again later."
      });
    }

    return NextResponse.json({ error: error.message || "Failed to generate vocabulary" }, { status: 500 });
  }
}
