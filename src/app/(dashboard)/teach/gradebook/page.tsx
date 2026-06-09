import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TeacherGradebook } from "./teacher-gradebook";

export default async function TeacherGradebookPage() {
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") redirect("/dashboard");

  const role = session.user.role;
  const userId = session.user.id;

  const courseWhere = role === "TEACHER" ? { teacherId: userId } : {};

  const courses = await db.course.findMany({
    where: courseWhere,
    include: {
      assignments: { include: { submissions: true }, orderBy: { dueDate: "asc" } },
      quizzes:     { include: { attempts: true },  orderBy: { createdAt: "asc" } },
    },
    orderBy: { title: "asc" },
  });

  // Fetch students by enrollment for each course — only show students actually enrolled.
  const studentsByCourse = Object.fromEntries(
    await Promise.all(
      courses.map(async (c) => [
        c.id,
        await db.user.findMany({
          where:   { enrollments: { some: { courseId: c.id } } },
          select:  { id: true, name: true, email: true },
          orderBy: { name: "asc" },
        }),
      ])
    )
  ) as Record<string, { id: string; name: string | null; email: string }[]>;

  return <TeacherGradebook courses={courses} studentsByCourse={studentsByCourse} />;
}
