import { NextResponse } from "next/server";
import { executeBackgroundTask } from "@/services/aiService";
import { examTopicsGeneratorPrompt } from "@/lib/vstep-prompt";

export async function GET(req: Request) {
  try {
    const aiPrompt = `Generate a completely unique and random VSTEP speaking test dataset right now. Do not use common topics. Ensure absolute JSON structural integrity.`;

    const text = await executeBackgroundTask(aiPrompt, examTopicsGeneratorPrompt, true);
    
    // Safety check just in case the model returns markdown code blocks
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanText);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Service Error (generate-exam-topics):", error);
    
    if (error.message && error.message.includes("AI_FALLBACK_TRIGGERED")) {
      return NextResponse.json({
        status: "fallback",
        message: "AI topic generator is temporarily unavailable. Please try again later."
      });
    }

    return NextResponse.json({ error: error.message || "Failed to generate exam topics" }, { status: 500 });
  }
}
