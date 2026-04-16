import { NextResponse } from "next/server";
import { generateAIFallback } from "@/lib/ai-fallback";

export async function POST(req: Request) {
  try {
    const { essay, prompt } = await req.json();

    const systemInstruction = `You are an expert English writing tutor specializing in VSTEP B1.
Your task is to analyze the user's essay, identify sentences with grammatical, vocabulary, or structural errors, and provide a corrected version along with a brief explanation.

Return a STRICT JSON array of objects (no markdown blocks or surrounding text).
Format:
[
  {
    "original": "The original sentence with errors.",
    "improved": "The corrected and improved sentence.",
    "explanation": "Brief explanation of the error."
  }
]
If there are no errors, return an empty array [].
`;

    const promptText = `
--- WRITING PROMPT ---
${prompt}

--- USER ESSAY ---
${essay}
`;

    // Use our robust fallback handler
    let aiResponseText = await generateAIFallback(systemInstruction, promptText);
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const corrections = JSON.parse(aiResponseText);

    return NextResponse.json({ corrections });

  } catch (error: any) {
    console.error("Writing Improvement API Error:", error.message);
    return NextResponse.json({ 
       error: "Improvement Analysis Failed", 
       details: error.message 
    }, { status: 500 });
  }
}
