import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    // Return aggregate total XP earned from the database
    const aggregate = await db.progress.aggregate({
      _sum: {
        xpEarned: true
      }
    });

    const totalXp = aggregate._sum.xpEarned || 0;
    
    // Can retrieve the latest activity to figure out streaks if needed
    const lastActivity = await db.progress.findFirst({
      orderBy: { completedAt: "desc" }
    });

    return NextResponse.json({ totalXp, lastActivity });
  } catch (error: any) {
    console.error("Database Error (GET progress):", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, xp } = await req.json();

    if (!type || typeof xp !== "number") {
      return NextResponse.json({ error: "Missing type or xp value" }, { status: 400 });
    }

    const log = await db.progress.create({
      data: {
        type: type,
        xpEarned: xp,
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error("Database Error (POST progress):", error);
    return NextResponse.json({ error: "Failed to log progress" }, { status: 500 });
  }
}
