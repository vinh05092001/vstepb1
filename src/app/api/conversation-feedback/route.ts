import { NextResponse } from "next/server";
import { executeLightweightTask } from "@/services/aiService";

export async function POST(req: Request) {
  try {
    const { history = [] } = await req.json();

    if (!history || history.length === 0) {
      return NextResponse.json({ error: "History is required" }, { status: 400 });
    }

    const conversationHistory = history.map((m: any) => `${m.role === "user" ? "Learner" : "Tutor"}: ${m.content}`).join("\n");
    
    const prompt = `Here is the transcript of an English conversation between a Learner and a Tutor:
${conversationHistory}

Analyze the Learner's English in this conversation.
Point out any significant grammar, vocabulary, or awkward phrasing mistakes.
Provide concrete suggestions for improvement.

Return ONLY a valid JSON object exactly matching this structure:
{
  "grammarMistakes": [ "string (mistakes string)" ],
  "awkwardPhrasing": [ "string (suggestions string)" ],
  "speakingScore": number (0-100),
  "feedback": "string (Overall encouraging assessment of their English)"
}`;

    const systemInstruction = "You are an expert English teacher API. Output ONLY valid JSON.";

    const text = await executeLightweightTask(prompt, systemInstruction, true);

    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    console.error("AI Service Error (conversation-feedback):", error);
    return NextResponse.json({ error: error.message || "Failed to generate feedback" }, { status: 500 });
  }
}
