import { NextResponse } from "next/server";
import { generateAIFallback } from "@/lib/ai-fallback";

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    const systemInstruction = `You are a strict VSTEP B1 speaking examiner.
Your task is to analyze a raw speech-to-text transcript and identify pronunciation, sentence stress, or fluency errors based on typical ESL mistakes.

Return a STRICT JSON object (no markdown blocks) with an array of objects for problematic words/phrases.
Format:
{
  "issues": [
    {
      "word": "enviroment",
      "issue": "Mispronounced or missing syllable.",
      "suggestion": "en-VI-ron-ment"
    }
  ]
}
If no major errors are detected, return {"issues": []}.
`;

    const promptText = `
--- USER SPEECH TRANSCRIPT ---
${transcript}
`;

    // Use our robust fallback handler
    let aiResponseText = await generateAIFallback(systemInstruction, promptText, "DeepReasoning");
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(aiResponseText);

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Pronunciation Analysis API Error:", error.message);
    return NextResponse.json({ 
       error: "Pronunciation Analysis Failed", 
       details: error.message 
    }, { status: 500 });
  }
}
