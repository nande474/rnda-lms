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

  // Fetch students by grade for each unique grade across the teacher's courses.
  // This covers students created via the "Add Student" flow (grade-tagged but not
  // formally enrolled) as well as self-enrolled students.
  const uniqueGrades = [...new Set(courses.map((c) => c.grade))];
  const studentsByGrade = Object.fromEntries(
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
  ) as Record<number, { id: string; name: string | null; email: string }[]>;

  return <TeacherGradebook courses={courses} studentsByGrade={studentsByGrade} />;
}
