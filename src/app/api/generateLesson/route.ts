import { NextResponse } from "next/server";
import { executeHeavyTask } from "@/services/aiService";
import { lessonGeneratorPrompt } from "@/lib/vstep-prompt";

export async function POST(req: Request) {
  try {
    const { weaknesses, level, selectedTopic } = await req.json();

    const aiPrompt = `
Generate a dedicated speaking lesson focused on resolving weaknesses or a chosen topic.

Target Level: ${level || "B1"}
Learner Weaknesses: ${weaknesses?.join(", ") || "None specified"}
Specific Topic Requested: ${selectedTopic || "Any general VSTEP topic"}

Ensure the questions perfectly align with the VSTEP format.
`;

    // executeHeavyTask with isJson parameter = true
    const text = await executeHeavyTask(aiPrompt, lessonGeneratorPrompt, true);
    
    // Safety generic parsing check since sometimes models return codeblocks
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanText);

    return NextResponse.json({ curriculum: result });
  } catch (error: any) {
    console.error("AI Service Error (generateLesson):", error);
    
    if (error.message && error.message.includes("AI_FALLBACK_TRIGGERED")) {
      return NextResponse.json({
        status: "fallback",
        message: "AI lesson generator is temporarily unavailable due to capacity limits. Please try again later."
      });
    }

    return NextResponse.json({ error: error.message || "Failed to generate lesson" }, { status: 500 });
  }
}
