import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);
    if (isNaN(taskId)) {
      return NextResponse.json({ success: false, error: "Invalid task ID" }, { status: 400 });
    }

    const body = await req.json();
    const { completed } = body;

    const updatedTask = await prisma.dailyTask.update({
      where: { id: taskId },
      data: { completed: Boolean(completed) }
    });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error: any) {
    console.error("[DailyTask PATCH Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
