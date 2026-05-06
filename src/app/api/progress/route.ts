import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { course: { include: { lessons: true, enrollments: { where: { userId: session.user.id } } } } },
  });

  if (!lesson || lesson.course.enrollments.length === 0) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    create: { userId: session.user.id, lessonId },
    update: {},
  });

  const allLessonIds = lesson.course.lessons.map((l) => l.id);
  const completed = await db.lessonProgress.count({
    where: { userId: session.user.id, lessonId: { in: allLessonIds } },
  });

  if (completed === allLessonIds.length) {
    await db.enrollment.update({
      where: { userId_courseId: { userId: session.user.id, courseId: lesson.courseId } },
      data: { completedAt: new Date() },
    });
    await db.certificate.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId: lesson.courseId } },
      create: { userId: session.user.id, courseId: lesson.courseId },
      update: {},
    });
  }

  return NextResponse.json({ ok: true, courseCompleted: completed === allLessonIds.length });
}
