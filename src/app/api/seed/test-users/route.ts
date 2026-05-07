import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const secret = req.headers.get("x-seed-secret");
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const password = await bcrypt.hash("Rnda@2024!", 12);

  const accounts = [
    { name: "RNDA Admin", email: "admin@rnda", role: "ADMIN" },
    { name: "Teacher One", email: "teacher1@rnda", role: "TEACHER" },
    { name: "Teacher Two", email: "teacher2@rnda", role: "TEACHER" },
    { name: "Teacher Three", email: "teacher3@rnda", role: "TEACHER" },
    { name: "Teacher Four", email: "teacher4@rnda", role: "TEACHER" },
    { name: "Teacher Five", email: "teacher5@rnda", role: "TEACHER" },
    { name: "Student One", email: "student1@rnda", role: "STUDENT" },
    { name: "Student Two", email: "student2@rnda", role: "STUDENT" },
    { name: "Student Three", email: "student3@rnda", role: "STUDENT" },
    { name: "Student Four", email: "student4@rnda", role: "STUDENT" },
    { name: "Student Five", email: "student5@rnda", role: "STUDENT" },
    { name: "Student Six", email: "student6@rnda", role: "STUDENT" },
    { name: "Student Seven", email: "student7@rnda", role: "STUDENT" },
    { name: "Student Eight", email: "student8@rnda", role: "STUDENT" },
    { name: "Student Nine", email: "student9@rnda", role: "STUDENT" },
    { name: "Student Ten", email: "student10@rnda", role: "STUDENT" },
    { name: "Student Eleven", email: "student11@rnda", role: "STUDENT" },
    { name: "Student Twelve", email: "student12@rnda", role: "STUDENT" },
    { name: "Student Thirteen", email: "student13@rnda", role: "STUDENT" },
    { name: "Student Fourteen", email: "student14@rnda", role: "STUDENT" },
    { name: "Student Fifteen", email: "student15@rnda", role: "STUDENT" },
    { name: "Student Sixteen", email: "student16@rnda", role: "STUDENT" },
    { name: "Student Seventeen", email: "student17@rnda", role: "STUDENT" },
    { name: "Student Eighteen", email: "student18@rnda", role: "STUDENT" },
    { name: "Student Nineteen", email: "student19@rnda", role: "STUDENT" },
    { name: "Student Twenty", email: "student20@rnda", role: "STUDENT" },
  ];

  for (const account of accounts) {
    await db.user.upsert({
      where: { email: account.email },
      update: { name: account.name, role: account.role, password },
      create: { ...account, password },
    });
  }

  return NextResponse.json({ ok: true, upserted: accounts.length });
}
