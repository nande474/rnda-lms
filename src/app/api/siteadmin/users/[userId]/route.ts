import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SITEADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;

  const target = await db.user.findUnique({ where: { id: userId }, select: { siteId: true, role: true } });
  if (!target || target.siteId !== session.user.siteId) {
    return NextResponse.json({ error: "User not found in your site" }, { status: 404 });
  }

  if (!["TEACHER", "STUDENT"].includes(target.role)) {
    return NextResponse.json({ error: "Cannot modify this user" }, { status: 403 });
  }

  const { role, grade } = await req.json();

  if (role && !["TEACHER", "STUDENT"].includes(role)) {
    return NextResponse.json({ error: "You can only assign Teacher or Student roles" }, { status: 400 });
  }

  const user = await db.user.update({
    where: { id: userId },
    data: {
      ...(role && { role }),
      ...(grade !== undefined && { grade }),
    },
  });

  return NextResponse.json({ user });
}
