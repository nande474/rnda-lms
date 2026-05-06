import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function TeachCoursesPage() {
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") redirect("/dashboard");

  const courses = await db.course.findMany({
    where: session.user.role === "ADMIN" ? {} : { teacherId: session.user.id },
    include: { lessons: true, enrollments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e5631]">My Courses</h1>
        <Link href="/teach/courses/new">
          <Button><Plus size={16} /> New Course</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-400">
            No courses yet. Create your first one!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{SUBJECT_ICONS[c.subject] ?? "📚"}</span>
                  <Badge variant={c.published ? "success" : "warning"}>
                    {c.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{c.title}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  {SUBJECTS[c.subject as keyof typeof SUBJECTS]} · Grade {c.grade}
                </p>
                <div className="flex gap-4 text-xs text-gray-400 mb-4">
                  <span>{c.lessons.length} lessons</span>
                  <span>{c.enrollments.length} students</span>
                </div>
                <Link href={`/teach/courses/${c.id}`}>
                  <Button variant="outline" size="sm" className="w-full">Manage</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
