import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { CourseEditor } from "./course-editor";

export default async function TeachCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") redirect("/dashboard");

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: { orderBy: { order: "asc" } },
      lessons: { orderBy: { order: "asc" } },
      assignments: {
        orderBy: { dueDate: "asc" },
        include: {
          submissions: {
            include: { user: { select: { name: true, email: true } } },
            orderBy: { submittedAt: "desc" },
          },
        },
      },
      enrollments: { include: { user: { select: { name: true, email: true, image: true } } } },
    },
  });

  if (!course) notFound();
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN" && course.teacherId !== session.user.id) {
    redirect("/dashboard");
  }

  return <CourseEditor course={course} />;
}
