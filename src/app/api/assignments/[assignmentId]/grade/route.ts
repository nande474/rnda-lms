import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;
  const session = await auth();
  const role = session?.user?.role ?? "";
  if (!["TEACHER", "ADMIN", "SUPERADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, grade, feedback } = await req.json();
  if (!userId || grade === undefined) {
    return NextResponse.json({ error: "userId and grade are required" }, { status: 400 });
  }

  const assignment = await db.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

  if (grade < 0 || grade > assignment.maxScore) {
    return NextResponse.json({ error: `Grade must be between 0 and ${assignment.maxScore}` }, { status: 400 });
  }

  const submission = await db.assignmentSubmission.update({
    where: { assignmentId_userId: { assignmentId, userId } },
    data: { grade: Number(grade), feedback, gradedAt: new Date(), gradedById: session!.user.id },
  });

  await db.notification.create({
    data: {
      userId,
      title: `Assignment graded: ${assignment.title}`,
      message: `You scored ${grade}/${assignment.maxScore}${feedback ? `. Feedback: ${feedback}` : ""}.`,
      type: "GRADE",
    },
  });

  return NextResponse.json({ submission });
}
