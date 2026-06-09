import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await auth();
  const role = session?.user?.role ?? "";
  if (!["TEACHER", "SITEADMIN", "ADMIN", "SUPERADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // Handle session lock/unlock
  if (typeof body.closed === "boolean") {
    await db.attendanceSession.update({ where: { id: sessionId }, data: { closed: body.closed } });
    return NextResponse.json({ ok: true });
  }

  const { records } = body;
  if (!Array.isArray(records)) {
    return NextResponse.json({ error: "records must be an array" }, { status: 400 });
  }

  await Promise.all(
    (records as Array<{ userId: string; present: boolean; notes?: string }>).map((r) =>
      db.attendanceRecord.upsert({
        where: { sessionId_userId: { sessionId, userId: r.userId } },
        update: { present: r.present, notes: r.notes },
        create: { sessionId, userId: r.userId, present: r.present, notes: r.notes },
      })
    )
  );

  const absent = (records as Array<{ userId: string; present: boolean }>).filter((r) => !r.present);
  if (absent.length > 0) {
    const sess = await db.attendanceSession.findUnique({ where: { id: sessionId }, select: { title: true } });
    await db.notification.createMany({
      data: absent.map((r) => ({
        userId: r.userId,
        title: "Absence recorded",
        message: `You were marked absent for "${sess?.title ?? "a session"}". Please contact your teacher.`,
        type: "ATTENDANCE",
      })),
    });
  }

  return NextResponse.json({ ok: true });
}
