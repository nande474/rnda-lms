import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, courseId, questions } = await req.json();

  const quiz = await db.quiz.create({
    data: {
      title,
      courseId,
      questions: {
        create: questions.map((q: { text: string; options: string[]; correctAnswer: number; explanation?: string }, i: number) => ({
          text: q.text,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation ?? null,
          order: i + 1,
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json({ quiz });
}
