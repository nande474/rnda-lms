import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { action, courseId, name, sectionId, lessonId } = await req.json();

  try {
    switch (action) {
      case "CREATE": {
        const maxOrder = await db.section.aggregate({
          where: { courseId },
          _max: { order: true },
        });
        const section = await db.section.create({
          data: { name, courseId, order: (maxOrder._max.order ?? 0) + 1 },
        });
        return NextResponse.json({ section });
      }

      case "UPDATE": {
        const section = await db.section.update({
          where: { id: sectionId },
          data: { name },
        });
        return NextResponse.json({ section });
      }

      case "DELETE": {
        await db.lesson.updateMany({ where: { sectionId }, data: { sectionId: null } });
        await db.section.delete({ where: { id: sectionId } });
        return NextResponse.json({ ok: true });
      }

      case "MOVE_LESSON": {
        await db.lesson.update({
          where: { id: lessonId },
          data: { sectionId: sectionId ?? null },
        });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to process section" }, { status: 500 });
  }
}
