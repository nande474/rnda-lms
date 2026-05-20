import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { SiteAdminDashboard } from "@/components/dashboards/siteadmin-dashboard";
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard";
import { StudentDashboard } from "@/components/dashboards/student-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { role, id } = session.user;

  if (role === "ADMIN" || role === "SUPERADMIN") {
    const [users, courses, enrollments] = await Promise.all([
      db.user.count(),
      db.course.count(),
      db.enrollment.count(),
    ]);
    return <AdminDashboard stats={{ users, courses, enrollments }} />;
  }

  if (role === "SITEADMIN") {
    const siteId = session.user.siteId;
    const [teachers, students] = await Promise.all([
      db.user.count({ where: { role: "TEACHER", siteId: siteId ?? undefined } }),
      db.user.count({ where: { role: "STUDENT", siteId: siteId ?? undefined } }),
    ]);
    return <SiteAdminDashboard siteId={siteId} stats={{ teachers, students }} />;
  }

  if (role === "TEACHER") {
    const courses = await db.course.findMany({
      where: { teacherId: id },
      include: { enrollments: true, lessons: true },
      orderBy: { createdAt: "desc" },
    });
    return <TeacherDashboard courses={courses} />;
  }

  const [enrollments, lessonProgress, submissionData] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: id },
      include: {
        course: {
          include: {
            lessons: true,
            teacher: { select: { name: true } },
            assignments: { include: { submissions: { where: { userId: id } } } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    db.lessonProgress.findMany({
      where: { userId: id },
      select: { lessonId: true, completedAt: true },
      orderBy: { completedAt: "desc" },
    }),
    db.assignmentSubmission.findMany({
      where: { userId: id, grade: { not: null } },
      select: { grade: true, assignment: { select: { maxScore: true, weight: true } } },
    }),
  ]);

  const completedLessonIds = new Set(lessonProgress.map((lp) => lp.lessonId));

  // Streak: consecutive days with lesson activity
  const activityDays = new Set(
    lessonProgress.map((lp) => new Date(lp.completedAt).toDateString())
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (activityDays.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  // Overall grade average
  const graded = submissionData.filter((s) => s.grade !== null);
  const overallAvg = graded.length > 0
    ? Math.round(
        graded.reduce((sum, s) => sum + ((s.grade! / s.assignment.maxScore) * 100 * s.assignment.weight), 0) /
        graded.reduce((sum, s) => sum + s.assignment.weight, 0)
      )
    : null;

  return (
    <StudentDashboard
      user={session.user}
      enrollments={enrollments}
      completedLessonIds={completedLessonIds}
      streak={streak}
      overallAvg={overallAvg}
    />
  );
}
