import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const courseId = url.searchParams.get("courseId");

  if (role === "STUDENT") {
    const courses = await db.course.findMany({
      where: courseId
        ? { id: courseId, enrollments: { some: { userId } } }
        : { enrollments: { some: { userId } } },
      include: {
        assignments: {
          include: { submissions: { where: { userId } } },
        },
        quizzes: {
          include: { attempts: { where: { userId }, orderBy: { completedAt: "desc" }, take: 1 } },
        },
      },
    });

    const gradebook = courses.map((course) => {
      const assignmentRows = course.assignments.map((a) => {
        const sub = a.submissions[0];
        return {
          type: "assignment" as const,
          id: a.id,
          title: a.title,
          maxScore: a.maxScore,
          weight: a.weight,
          score: sub?.grade ?? null,
          submitted: !!sub,
          dueDate: a.dueDate,
        };
      });

      const quizRows = course.quizzes.map((q) => {
        const attempt = q.attempts[0];
        return {
          type: "quiz" as const,
          id: q.id,
          title: q.title,
          maxScore: attempt?.maxScore ?? 0,
          weight: 0.5,
          score: attempt?.score ?? null,
          submitted: !!attempt,
          dueDate: null,
        };
      });

      const all = [...assignmentRows, ...quizRows];
      const graded = all.filter((r) => r.score !== null);
      const weightedSum = graded.reduce((s, r) => s + (r.score! / r.maxScore) * r.weight * 100, 0);
      const totalWeight = graded.reduce((s, r) => s + r.weight, 0);
      const average = totalWeight > 0 ? weightedSum / totalWeight : null;

      return { courseId: course.id, courseTitle: course.title, rows: all, average };
    });

    return NextResponse.json({ gradebook });
  }

  if (["TEACHER", "ADMIN", "SUPERADMIN", "SITEADMIN"].includes(role)) {
    const courseWhere = role === "TEACHER"
      ? { teacherId: userId, ...(courseId ? { id: courseId } : {}) }
      : courseId
      ? { id: courseId }
      : {};

    const courses = await db.course.findMany({
      where: courseWhere,
      include: {
        enrollments: { include: { user: { select: { id: true, name: true, email: true } } } },
        assignments: { include: { submissions: true } },
        quizzes: { include: { attempts: true } },
      },
    });

    const gradebook = courses.map((course) => {
      const students = course.enrollments.map((e) => e.user);
      const studentGrades = students.map((student) => {
        const assignmentRows = course.assignments.map((a) => {
          const sub = a.submissions.find((s) => s.userId === student.id);
          return { type: "assignment" as const, title: a.title, maxScore: a.maxScore, weight: a.weight, score: sub?.grade ?? null, submitted: !!sub };
        });
        const quizRows = course.quizzes.map((q) => {
          const attempt = q.attempts.filter((at) => at.userId === student.id).sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())[0];
          return { type: "quiz" as const, title: q.title, maxScore: attempt?.maxScore ?? 0, weight: 0.5, score: attempt?.score ?? null, submitted: !!attempt };
        });
        const all = [...assignmentRows, ...quizRows];
        const graded = all.filter((r) => r.score !== null && r.maxScore > 0);
        const weightedSum = graded.reduce((s, r) => s + (r.score! / r.maxScore) * r.weight * 100, 0);
        const totalWeight = graded.reduce((s, r) => s + r.weight, 0);
        const average = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : null;
        return { student, rows: all, average };
      });
      return { courseId: course.id, courseTitle: course.title, columns: [...course.assignments.map((a) => ({ id: a.id, title: a.title, type: "assignment", maxScore: a.maxScore })), ...course.quizzes.map((q) => ({ id: q.id, title: q.title, type: "quiz", maxScore: 100 }))], studentGrades };
    });

    return NextResponse.json({ gradebook });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
