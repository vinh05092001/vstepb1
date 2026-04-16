import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { executeLightweightTask } from "@/services/aiService";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Determine today's date in local YYYY-MM-DD
    const today = new Date();
    // Use standard local offset to get accurate calendar day
    const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];

    // Check if a plan already exists for today
    let plan = await prisma.dailyPlan.findUnique({
      where: { date: dateString },
      include: { tasks: true }
    });

    if (plan) {
      return NextResponse.json({ success: true, plan });
    }

    // Call AI to generate 5 daily tasks tailored for VSTEP B1.
    // We enforce the JSON schema structurally in the prompt.
    const prompt = `
You are an expert VSTEP B1 English Coach. Generate a highly specific Daily Study Plan for a student.
You must return exactly 5 tasks covering these specific skills:
1. Vocabulary
2. Speaking Part 1
3. Speaking Part 2
4. Writing 
5. Review Mistakes

Return the result as a raw JSON array of 5 objects. Each object must have these exactly matching keys:
"title": <string, a highly specific actionable title like "Learn 5 words about Environment">
"type": <string, exactly one of: "vocabulary", "speaking_part1", "speaking_part2", "writing", "review">
"actionUrl": <string, the URL to complete it: "/vocabulary" or "/speaking/part1" or "/speaking/part2" or "/writing" or "/insights">

Example output format:
[
  { "title": "Review 5 Topic Vocabulary words", "type": "vocabulary", "actionUrl": "/vocabulary" }
]

CRITICAL: Output absolutely nothing but the valid JSON array. No markdown blocks.
    `;

    console.log("[DailyPlan] Contacting AI to generate new B1 tasks...");
    const rawAiResponse = await executeLightweightTask(
      prompt,
      "You are a strict JSON-only API. Only output valid JSON.",
      true
    );

    // Use regex to strictly extract the JSON array regardless of conversational filler
    let cleanJsonStr = rawAiResponse;
    const match = rawAiResponse.match(/\[[\s\S]*\]/);
    if (match) {
      cleanJsonStr = match[0];
    }

    const aiPlan = JSON.parse(cleanJsonStr);

    if (!Array.isArray(aiPlan) || aiPlan.length === 0) {
      throw new Error("AI returned invalid array format.");
    }

    // Insert into DB
    plan = await prisma.dailyPlan.create({
      data: {
        date: dateString,
        tasks: {
          create: aiPlan.map(task => ({
            title: task.title,
            type: task.type,
            actionUrl: task.actionUrl,
            completed: false
          }))
        }
      },
      include: { tasks: true }
    });

    return NextResponse.json({ success: true, plan });

  } catch (error: any) {
    console.error("[DailyPlan API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate daily plan" },
      { status: 500 }
    );
  }
}
