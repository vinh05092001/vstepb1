import { NextResponse } from "next/server";
import { generateAIFallback } from "@/lib/ai-fallback";
import { VSTEP_COACH_PROMPT } from "@/lib/vstep-prompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { speaking, writing } = body;

    const systemInstruction = `${VSTEP_COACH_PROMPT}

ADDITIONAL EXAMINER INSTRUCTIONS:
You are currently evaluating a Mock Test (Mock test mode). You will evaluate a set of Speaking transcripts (Parts 1, 2, 3) and a Writing essay provided by the user.

SCORE SCALE: 0 to 10 for both sections.
- Speaking grading criteria: Pronunciation, Fluency, Grammar, Vocabulary, Coherence. Target B1 level (Score > 5 indicates B1 pass).
- Writing grading criteria: Task Completion, Grammar, Vocabulary, Coherence. Target B1 level.

REQUIRED OUTPUT FORMAT: You must return a strict JSON object with these exact fields (no markdown blocks, just raw JSON text):
{
  "speakingScore": 7,
  "speakingFeedback": "Detailed feedback summarizing performance across all speaking parts...",
  "writingScore": 6,
  "writingFeedback": "Detailed feedback focusing on task completion, layout, and grammatical corrections..."
}`;

    // Flatten the speaking parts
    let speakingEvalText = "";
    if (speaking && speaking.tasks) {
       speaking.tasks.forEach((task: any, index: number) => {
          speakingEvalText += `\n[Part ${task.part}] Prompt: ${task.prompt}\nTranscript: "${speaking.transcripts[index]}"\n`;
       });
    } else if (speaking && speaking.prompt && speaking.transcript) {
       speakingEvalText = `\n[Part ${speaking.part}] Prompt: ${speaking.prompt}\nTranscript: "${speaking.transcript}"\n`;
    }

    const promptText = `
--- SPEAKING COMPONENT ---
${speakingEvalText}

--- WRITING TASK 1 (${writing.type}) ---
Prompt: ${writing.prompt}
User Essay: "${writing.essay}"

Evaluate the above submissions acting as a VSTEP examiner. Return the JSON object as defined.
`;

    // Use our robust fallback handler
    let aiResponseText = await generateAIFallback(systemInstruction, promptText, "DeepReasoning");
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(aiResponseText);

    return NextResponse.json({
       speakingScore: parsedData.speakingScore || 0,
       speakingFeedback: parsedData.speakingFeedback || "No feedback provided by AI.",
       writingScore: parsedData.writingScore || 0,
       writingFeedback: parsedData.writingFeedback || "No feedback provided by AI."
    });

  } catch (error: any) {
    console.error("VSTEP Analysis API Error:", error.message);
    return NextResponse.json({ 
       error: "AI Evaluation Failed", 
       details: error.message 
    }, { status: 500 });
  }
}
