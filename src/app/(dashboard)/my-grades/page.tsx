import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { StudentGrades } from "./student-grades";

export default async function MyGradesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const courses = await db.course.findMany({
    where: { enrollments: { some: { userId } } },
    include: {
      assignments: {
        orderBy: { dueDate: "asc" },
        include: { submissions: { where: { userId } } },
      },
      quizzes: {
        include: { attempts: { where: { userId }, orderBy: { completedAt: "desc" } } },
      },
    },
    orderBy: { title: "asc" },
  });

  return <StudentGrades courses={courses} />;
}
