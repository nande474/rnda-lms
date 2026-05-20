import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: "Missing courseId" }, { status: 400 });

  const course = await db.course.findUnique({ where: { id: courseId, published: true } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const role = session.user.role;
  const isPrivileged = ["ADMIN", "SUPERADMIN", "TEACHER", "SITEADMIN"].includes(role);

  if (!isPrivileged && session.user.grade && course.grade !== session.user.grade) {
    return NextResponse.json(
      { error: `This course is for Grade ${course.grade}. You are in Grade ${session.user.grade}.` },
      { status: 403 }
    );
  }

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (existing) return NextResponse.json({ enrollment: existing });

  const enrollment = await db.enrollment.create({
    data: { userId: session.user.id, courseId },
  });

  return NextResponse.json({ enrollment });
}
