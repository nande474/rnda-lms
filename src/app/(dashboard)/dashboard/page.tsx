import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard";
import { StudentDashboard } from "@/components/dashboards/student-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { role, id } = session.user;

  if (role === "ADMIN") {
    const [users, courses, enrollments] = await Promise.all([
      db.user.count(),
      db.course.count(),
      db.enrollment.count(),
    ]);
    return <AdminDashboard stats={{ users, courses, enrollments }} />;
  }

  if (role === "TEACHER") {
    const courses = await db.course.findMany({
      where: { teacherId: id },
      include: { enrollments: true, lessons: true },
      orderBy: { createdAt: "desc" },
    });
    return <TeacherDashboard courses={courses} />;
  }

  const enrollments = await db.enrollment.findMany({
    where: { userId: id },
    include: {
      course: {
        include: { lessons: true, teacher: { select: { name: true } } },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const lessonProgress = await db.lessonProgress.findMany({
    where: { userId: id },
    select: { lessonId: true },
  });

  const completedLessonIds = new Set(lessonProgress.map((lp) => lp.lessonId));

  return (
    <StudentDashboard
      user={session.user}
      enrollments={enrollments}
      completedLessonIds={completedLessonIds}
    />
  );
}
