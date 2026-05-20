import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  const currentRole = session?.user?.role ?? "";
  if (!["ADMIN", "SUPERADMIN"].includes(currentRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ROLE_LEVEL: Record<string, number> = {
    STUDENT: 1, TEACHER: 2, SITEADMIN: 3, ADMIN: 4, SUPERADMIN: 5,
  };

  const { name, email, role, grade, siteId, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: (role && (ROLE_LEVEL[role] ?? 0) < (ROLE_LEVEL[currentRole] ?? 0)) ? role : "STUDENT",
      grade: grade ? Number(grade) : null,
      siteId: siteId ? Number(siteId) : null,
    },
  });

  return NextResponse.json({ user });
}
