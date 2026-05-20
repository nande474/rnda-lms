import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SITEADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!session.user.siteId) {
    return NextResponse.json({ error: "You are not assigned to a site." }, { status: 403 });
  }

  const { name, email, role, grade, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  }

  if (!["TEACHER", "STUDENT"].includes(role ?? "")) {
    return NextResponse.json({ error: "Site admins can only create teachers and students" }, { status: 400 });
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
      role: role ?? "STUDENT",
      grade: grade ? Number(grade) : null,
      siteId: session.user.siteId,
    },
  });

  return NextResponse.json({ user });
}
