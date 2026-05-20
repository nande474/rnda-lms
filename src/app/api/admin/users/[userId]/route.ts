import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { NextResponse } from "next/server";

const ROLE_LEVEL: Record<string, number> = {
  STUDENT:    1,
  TEACHER:    2,
  SITEADMIN:  3,
  ADMIN:      4,
  SUPERADMIN: 5,
};

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  const currentRole = session?.user?.role ?? "";
  const currentLevel = ROLE_LEVEL[currentRole] ?? 0;

  if (!session?.user || currentLevel < ROLE_LEVEL.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;

  const target = await db.user.findUnique({ where: { id: userId }, select: { role: true, grade: true, siteId: true } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const targetLevel = ROLE_LEVEL[target.role] ?? 0;

  if (targetLevel >= currentLevel) {
    return NextResponse.json({ error: "You cannot modify a user with equal or higher role." }, { status: 403 });
  }

  const { role, grade, siteId } = await req.json();

  if (role) {
    const newLevel = ROLE_LEVEL[role] ?? 0;
    if (newLevel >= currentLevel) {
      return NextResponse.json({ error: "You cannot assign a role equal to or higher than your own." }, { status: 403 });
    }
  }

  const user = await db.user.update({
    where: { id: userId },
    data: {
      ...(role                && { role }),
      ...(grade  !== undefined && { grade }),
      ...(siteId !== undefined && { siteId }),
    },
  });

  const changes: Record<string, unknown> = {};
  if (role   !== undefined) changes.role   = { from: target.role,   to: role };
  if (grade  !== undefined) changes.grade  = { from: target.grade,  to: grade };
  if (siteId !== undefined) changes.siteId = { from: target.siteId, to: siteId };
  await logAudit(session.user.id, "USER_UPDATE", "USER", userId, changes);

  return NextResponse.json({ user });
}
