import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;
  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role !== "ADMIN" && course.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, content, videoUrl, resourceUrl, duration, sectionId } = await req.json();

  const maxOrder = await db.lesson.aggregate({
    where: { courseId },
    _max: { order: true },
  });

  const lesson = await db.lesson.create({
    data: {
      title,
      content,
      videoUrl: videoUrl || null,
      resourceUrl: resourceUrl || null,
      duration: duration ? Number(duration) : null,
      order: (maxOrder._max.order ?? 0) + 1,
      courseId,
      sectionId: sectionId || null,
    },
  });

  return NextResponse.json({ lesson });
}
