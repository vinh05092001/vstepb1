import { NextResponse } from "next/server";
import { executeLightweightTask } from "@/services/aiService";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, ideas } = body;

    if (!topic || !ideas) {
      return NextResponse.json({ error: "Missing topic or ideas" }, { status: 400 });
    }

    const aiPrompt = `Task: Combine the following ideas into a natural, cohesive 2-3 sentence paragraph suitable for a VSTEP Speaking answer.
Topic: ${topic}
Ideas to use: ${ideas}

Rules:
1. Make it sound like a natural spoken response.
2. Ensure coherence and good flow.
3. Use simple but accurate grammar (B1-B2 level).
4. Do NOT include any filler text, introductory phrases like "Here is the answer". Just the exact paragraph.`;

    const systemPrompt = "You are a helpful English speaking tutor assisting a Vietnamese learner preparing for the VSTEP exam.";

    const text = await executeLightweightTask(aiPrompt, systemPrompt, false);

    return NextResponse.json({ answer: text.trim() });
  } catch (error: any) {
    console.error("Error building speaking answer:", error);
    return NextResponse.json({ error: error.message || "Failed to build speaking answer" }, { status: 500 });
  }
}
