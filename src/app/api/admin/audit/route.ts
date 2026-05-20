import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const PAGE_SIZE = 50;

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const action = searchParams.get("action") ?? undefined;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where:   action ? { action } : undefined,
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip:    (page - 1) * PAGE_SIZE,
      take:    PAGE_SIZE,
    }),
    db.auditLog.count({ where: action ? { action } : undefined }),
  ]);

  return NextResponse.json({ logs, total, page, pageSize: PAGE_SIZE });
}
