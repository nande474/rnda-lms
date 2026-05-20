import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  if (!["TEACHER", "SITEADMIN", "ADMIN", "SUPERADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, date, courseId, studentIds } = await req.json();
  if (!title || !date) {
    return NextResponse.json({ error: "title and date are required" }, { status: 400 });
  }

  const session_ = await db.attendanceSession.create({
    data: {
      title,
      date: new Date(date),
      siteId: session!.user.siteId ?? undefined,
      courseId: courseId ?? undefined,
      teacherId: session!.user.id,
    },
  });

  if (studentIds?.length) {
    await db.attendanceRecord.createMany({
      data: (studentIds as string[]).map((userId: string) => ({
        sessionId: session_.id,
        userId,
        present: false,
      })),
    });
  }

  return NextResponse.json({ session: session_ });
}

export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  if (!["TEACHER", "SITEADMIN", "ADMIN", "SUPERADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");

  const where = role === "TEACHER"
    ? { teacherId: session!.user.id, ...(courseId ? { courseId } : {}) }
    : role === "SITEADMIN"
    ? { siteId: session!.user.siteId ?? undefined }
    : courseId
    ? { courseId }
    : {};

  const sessions = await db.attendanceSession.findMany({
    where,
    include: { records: { include: { user: { select: { name: true, email: true } } } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ sessions });
}
