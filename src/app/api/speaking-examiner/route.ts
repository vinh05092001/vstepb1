import { NextResponse } from "next/server";
import { executeHeavyTask, executeLightweightTask } from "@/services/aiService";
import { speakingExaminerPrompt } from "@/lib/vstep-prompt";

function stringSimilarity(str1: string, str2: string) {
  if (str1.length < 2 || str2.length < 2) return 0;
  
  const getBigrams = (str: string) => {
    const s = str.toLowerCase();
    const v = [];
    for (let i = 0; i < s.length - 1; i++) {
        v.push(s.slice(i, i + 2));
    }
    return v;
  };

  const bigrams1 = getBigrams(str1);
  const bigrams2 = getBigrams(str2);
  let intersection = 0;
  
  for (let i = 0; i < bigrams1.length; i++) {
    for (let j = 0; j < bigrams2.length; j++) {
      if (bigrams1[i] === bigrams2[j]) {
        intersection++;
        bigrams2[j] = ""; // nullify to prevent recounting
        break;
      }
    }
  }
  return (2.0 * intersection) / (bigrams1.length + bigrams2.length);
}

export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Convert messages to string format
    const conversationHistory = messages.map((m: any) => `${m.role === "user" ? "Candidate" : "Examiner"}: ${m.content}`).join("\n");
    
    // Extract history of previous questions asked by the examiner (AI)
    const previousQuestions = messages
      .filter((m: any) => m.role === "assistant" || m.role === "Examiner" || m.role === "model")
      .map((m: any) => m.content);

    const previousQuestionsStr = previousQuestions.length > 0 
        ? `\nPrevious questions in this session:\n${previousQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")}\n\nInstruction:\nGenerate a NEW question that is different from all previous questions.`
        : "";

    let prompt = `Conversation history:
${conversationHistory}
${previousQuestionsStr}
Examiner:`;

    // Duplicate Detection and Mitigation Loop
    let attempt = 0;
    const maxAttempts = 3;
    let finalValidText = "";

    while (attempt < maxAttempts) {
       let text = await executeLightweightTask(prompt, speakingExaminerPrompt, false);
       
       // Calculate highest similarity with any previous question
       let maxSim = 0;
       for (const pastQ of previousQuestions) {
           const sim = stringSimilarity(text, pastQ);
           if (sim > maxSim) maxSim = sim;
       }

       if (maxSim > 0.8) {
           console.log(`[Duplicate Prevention] Similarity ${maxSim.toFixed(2)} detected. Regenerating attempt ${attempt + 1}...`);
           // If it's a duplicate, we heavily penalize it in the next loop iteration
           prompt += `\nSystem Warning: Your previous generation was heavily repetitive or too similar to an existing question (similarity score: ${maxSim.toFixed(2)}). You MUST generate a completely different question with diverse vocabulary and structure now.\nExaminer:`;
           attempt++;
       } else {
           finalValidText = text;
           break;
       }
    }

    // Fallback if all attempts still yielded > 0.8 similarity
    if (!finalValidText) {
        console.warn(`[Duplicate Prevention] Exhausted attempts. Yielding last generated string anyway.`);
        finalValidText = await executeLightweightTask(prompt, speakingExaminerPrompt, false);
    }

    return NextResponse.json({ reply: finalValidText });
  } catch (error: any) {
    console.error("AI Service Error (speaking-examiner):", error);
    
    if (error.message && error.message.includes("AI_FALLBACK_TRIGGERED")) {
      return NextResponse.json({
        status: "fallback",
        message: "AI service is temporarily unavailable due to capacity limits. You can continue the conversation and the system will retry."
      });
    }

    return NextResponse.json({ error: error.message || "Failed to generate reply" }, { status: 500 });
  }
}
