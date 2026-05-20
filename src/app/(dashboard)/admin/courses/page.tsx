import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";

type AdminCourse = {
  id: string;
  title: string;
  subject: string;
  grade: number;
  published: boolean;
  teacher: { name: string | null };
  lessons: Array<{ id: string }>;
  enrollments: Array<{ id: string }>;
};

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) redirect("/dashboard");

  const courses = (await db.course.findMany({
    include: {
      teacher: { select: { name: true } },
      lessons: { select: { id: true } },
      enrollments: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  })) as unknown as AdminCourse[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1e5631]">All Courses</h1>
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
              <p className="text-xs text-gray-500 mb-1">
                {SUBJECTS[c.subject as keyof typeof SUBJECTS]} · Grade {c.grade}
              </p>
              <p className="text-xs text-gray-400 mb-3">By {c.teacher.name}</p>
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
    </div>
  );
}
