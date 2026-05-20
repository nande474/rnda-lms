import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROLE_LEVEL: Record<string, number> = {
  STUDENT: 1, TEACHER: 2, SITEADMIN: 3, ADMIN: 4, SUPERADMIN: 5,
};

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (ROLE_LEVEL[session.user.role] ?? 0) < ROLE_LEVEL.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { active } = await req.json();

  const announcement = await db.announcement.update({
    where: { id },
    data:  { active },
  });

  return NextResponse.json({ announcement });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (ROLE_LEVEL[session.user.role] ?? 0) < ROLE_LEVEL.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await db.announcement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
