import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { CourseDetail } from "@/components/courses/course-detail";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: { select: { name: true, image: true } },
      sections: { orderBy: { order: "asc" } },
      lessons: { orderBy: { order: "asc" } },
      quizzes: { include: { questions: true } },
      assignments: {
        orderBy: { dueDate: "asc" },
        include: {
          submissions: {
            where: { userId: session.user.id },
          },
        },
      },
    },
  });

  if (!course || !course.published) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });

  const lessonProgress = enrollment
    ? await db.lessonProgress.findMany({
        where: { userId: session.user.id },
        select: { lessonId: true },
      })
    : [];

  const completedIds = new Set(lessonProgress.map((lp) => lp.lessonId));

  return (
    <CourseDetail
      course={course}
      enrolled={!!enrollment}
      userId={session.user.id}
      completedIds={completedIds}
    />
  );
}
