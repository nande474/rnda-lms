import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, subject, grade } = await req.json();

  const course = await db.course.create({
    data: {
      title,
      description,
      subject,
      grade: Number(grade),
      teacherId: session.user.id,
    },
  });

  return NextResponse.json({ course });
}
