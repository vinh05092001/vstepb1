import { NextResponse } from "next/server";
import { executeHeavyTask } from "@/services/aiService";
import { generalTutorPrompt } from "@/lib/vstep-prompt";

export async function POST(req: Request) {
  try {
    const { messages = [], role = "Friendly Tutor" } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Convert chat history into a single string prompt for Gemini
    const conversationHistory = messages.map((m: any) => `${m.role === "user" ? "Learner" : "Tutor"}: ${m.content}`).join("\n");
    
    const prompt = `Here is the conversation so far:
${conversationHistory}
Tutor:`;

    const systemInstruction = `${generalTutorPrompt}

ADDITIONAL CONTEXT: You are currently playing the role of a ${role}. keep your responses conversational, natural, and relatively short (2-4 sentences max).`;

    const text = await executeHeavyTask(prompt, systemInstruction, false);

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("AI Service Error (conversation):", error);
    
    if (error.message && error.message.includes("AI_FALLBACK_TRIGGERED")) {
      return NextResponse.json({
        status: "fallback",
        message: "AI service is temporarily unavailable due to capacity limits. You can continue the conversation and the system will retry."
      });
    }

    return NextResponse.json({ error: error.message || "Failed to generate reply" }, { status: 500 });
  }
}
