import { NextResponse } from "next/server";
import { executeBackgroundTask } from "@/services/aiService";
import {
  writingPart1GeneratorPrompt,
  writingPart2GeneratorPrompt,
} from "@/lib/vstep-prompt";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const part = searchParams.get("part") || "1";

    const aiPrompt =
      part === "2"
        ? `Generate a completely unique and random VSTEP writing task 2 (essay format) right now. Do not use common topics. Ensure absolute JSON structural integrity.`
        : `Generate a completely unique and random VSTEP writing task 1 (letter format) right now. Do not use common topics. Ensure absolute JSON structural integrity.`;

    const systemPrompt =
      part === "2" ? writingPart2GeneratorPrompt : writingPart1GeneratorPrompt;

    const text = await executeBackgroundTask(aiPrompt, systemPrompt, true);

    // Safety check just in case the model returns markdown code blocks
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const result = JSON.parse(cleanText);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Service Error (generate-writing-topics):", error);

    if (error.message && error.message.includes("AI_FALLBACK_TRIGGERED")) {
      return NextResponse.json({
        status: "fallback",
        message:
          "AI topic generator is temporarily unavailable. Please try again later.",
      });
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate writing topic" },
      { status: 500 },
    );
  }
}
