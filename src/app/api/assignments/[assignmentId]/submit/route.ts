import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assignment = await db.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

  const enrolled = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: assignment.courseId } },
  });
  if (!enrolled && session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
  }

  const { content, fileUrl } = await req.json();
  if (!content && !fileUrl) {
    return NextResponse.json({ error: "Provide content or a file URL" }, { status: 400 });
  }

  const submission = await db.assignmentSubmission.upsert({
    where: { assignmentId_userId: { assignmentId, userId: session.user.id } },
    update: { content, fileUrl, submittedAt: new Date(), grade: null, feedback: null, gradedAt: null },
    create: { assignmentId, userId: session.user.id, content, fileUrl },
  });

  return NextResponse.json({ submission });
}
