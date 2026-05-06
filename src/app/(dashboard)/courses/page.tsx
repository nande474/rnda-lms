import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseBrowser } from "@/components/courses/course-browser";

export default async function CoursesPage() {
  const session = await auth();

  const [courses, enrollments] = await Promise.all([
    db.course.findMany({
      where: { published: true },
      include: {
        teacher: { select: { name: true } },
        lessons: { select: { id: true } },
        enrollments: { select: { userId: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    session?.user
      ? db.enrollment.findMany({
          where: { userId: session.user.id },
          select: { courseId: true },
        })
      : [],
  ]);

  const enrolledIds = new Set(enrollments.map((e) => e.courseId));

  return <CourseBrowser courses={courses} enrolledIds={enrolledIds} userGrade={session?.user.grade ?? null} />;
}
