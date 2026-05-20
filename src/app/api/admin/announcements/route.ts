import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ROLE_LEVEL: Record<string, number> = {
  STUDENT: 1, TEACHER: 2, SITEADMIN: 3, ADMIN: 4, SUPERADMIN: 5,
};

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = (ROLE_LEVEL[session.user.role] ?? 0) >= ROLE_LEVEL.ADMIN;

  if (isAdmin) {
    const announcements = await db.announcement.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ announcements });
  }

  // Regular users only see active, non-expired announcements
  const now = new Date();
  const announcements = await db.announcement.findMany({
    where: {
      active: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ announcements });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (ROLE_LEVEL[session.user.role] ?? 0) < ROLE_LEVEL.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, message, expiresAt } = await req.json();
  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
  }

  const announcement = await db.announcement.create({
    data: {
      title:     title.trim(),
      message:   message.trim(),
      authorId:  session.user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json({ announcement }, { status: 201 });
}
