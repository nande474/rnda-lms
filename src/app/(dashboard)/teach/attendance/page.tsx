import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AttendanceManager } from "./attendance-manager";

export default async function AttendancePage() {
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") redirect("/dashboard");

  const role = session.user.role;
  const userId = session.user.id;
  const siteId = session.user.siteId;

  const courseWhere = role === "TEACHER" ? { teacherId: userId } : {};

  const [attendanceSessions, courses] = await Promise.all([
    db.attendanceSession.findMany({
      where: role === "TEACHER"   ? { teacherId: userId }
           : role === "SITEADMIN" ? { siteId: siteId ?? undefined }
           : {},
      include: {
        records: { include: { user: { select: { name: true, email: true } } } },
        course:  { select: { title: true } },
      },
      orderBy: { date: "desc" },
    }),
    db.course.findMany({ where: courseWhere, select: { id: true, title: true, grade: true } }),
  ]);

  // For each course, fetch enrolled students by grade (matching school context).
  // Falls back gracefully to empty if a course has no grade-matched students yet.
  const uniqueGrades = [...new Set(courses.map((c) => c.grade))];
  const gradeStudents = Object.fromEntries(
    await Promise.all(
      uniqueGrades.map(async (g) => [
        g,
        await db.user.findMany({
          where:   { role: "STUDENT", grade: g },
          select:  { id: true, name: true, email: true },
          orderBy: { name: "asc" },
        }),
      ])
    )
  );
  const courseStudentsMap: Record<string, { id: string; name: string | null; email: string }[]> =
    Object.fromEntries(courses.map((c) => [c.id, gradeStudents[c.grade] ?? []]));

  // Fallback all-students list (used when no course is selected for a session)
  const allStudents =
    role === "SITEADMIN"
      ? await db.user.findMany({ where: { role: "STUDENT", siteId: siteId ?? undefined }, select: { id: true, name: true, email: true } })
      : await db.user.findMany({ where: { role: "STUDENT" }, select: { id: true, name: true, email: true } });

  return (
    <AttendanceManager
      attendanceSessions={attendanceSessions}
      courses={courses}
      courseStudentsMap={courseStudentsMap}
      fallbackStudents={allStudents}
      teacherId={userId}
    />
  );
}
