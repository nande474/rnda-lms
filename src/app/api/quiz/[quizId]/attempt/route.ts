import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId } = await params;
  const { answers } = await req.json();

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let score = 0;
  const results = quiz.questions.map((q, i) => {
    const correct = q.correctAnswer === answers[i];
    if (correct) score++;
    return {
      questionId: q.id,
      selected: answers[i],
      correct,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  });

  await db.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId,
      score,
      maxScore: quiz.questions.length,
      answers: JSON.stringify(answers),
    },
  });

  return NextResponse.json({
    score,
    maxScore: quiz.questions.length,
    percentage: Math.round((score / quiz.questions.length) * 100),
    results,
  });
}
