import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;
  const { role, grade } = await req.json();

  const user = await db.user.update({
    where: { id: userId },
    data: { ...(role && { role }), ...(grade !== undefined && { grade }) },
  });

  return NextResponse.json({ user });
}
