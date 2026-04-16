import { NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Profile is required" }, { status: 400 });
    }

    const level = profile.level || "Beginner";

    // Randomize the starting block of lessons from the DB to give variety
    const totalLessons = await db.lesson.count({ where: { level } });
    const skip = Math.max(0, Math.floor(Math.random() * (totalLessons - 5)));

    const lessonsData = await db.lesson.findMany({
      where: { level },
      skip: skip,
      take: 5,
      include: {
        grammar: true,
        vocabulary: {
          include: { vocabulary: true }
        }
      }
    });

    const curriculum = lessonsData.map((lesson, index) => {
      // Mocking variations of multiple-choice questions purely in code without AI
      const correctVocab = lesson.vocabulary[0]?.vocabulary || { word: "the", meaning: "article" };
      return {
        day: index + 1,
        title: lesson.topic,
        description: `Learn about ${lesson.topic} and master ${lesson.grammar?.title || "new grammar"}.`,
        grammarPoint: lesson.grammar?.explanation || "Grammar practice.",
        vocabulary: lesson.vocabulary.map((v) => ({
          word: v.vocabulary.word,
          meaning: v.vocabulary.meaning,
          example: v.vocabulary.exampleSentence || ""
        })).slice(0, 5),
        practiceQuestions: [
          {
            question: `What does "${correctVocab.word}" mean?`,
            options: [correctVocab.meaning, "Incorrect meaning A", "Incorrect meaning B", "Incorrect meaning C"].sort(() => Math.random() - 0.5),
            correctAnswer: correctVocab.meaning
          }
        ]
      };
    });

    return NextResponse.json({ curriculum });
  } catch (error: any) {
    console.error("Database Error (generateCurriculum):", error);
    return NextResponse.json({ error: error.message || "Failed to generate local curriculum" }, { status: 500 });
  }
}

