import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  if (!["TEACHER", "ADMIN", "SUPERADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, dueDate, courseId, maxScore, weight } = await req.json();
  if (!title || !courseId || !dueDate) {
    return NextResponse.json({ error: "title, courseId and dueDate are required" }, { status: 400 });
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (role === "TEACHER" && course.teacherId !== session!.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const assignment = await db.assignment.create({
    data: {
      title,
      description: description ?? "",
      dueDate: new Date(dueDate),
      courseId,
      maxScore: maxScore ? Number(maxScore) : 100,
      weight: weight ? Number(weight) : 1.0,
    },
  });

  await db.notification.createMany({
    data: (
      await db.enrollment.findMany({ where: { courseId }, select: { userId: true } })
    ).map((e) => ({
      userId: e.userId,
      title: `New assignment: ${title}`,
      message: `A new assignment has been posted in your course. Due: ${new Date(dueDate).toLocaleDateString("en-ZA")}.`,
      type: "ASSIGNMENT",
    })),
  });

  return NextResponse.json({ assignment });
}
