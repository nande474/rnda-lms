import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateProgress, SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          lessons: { select: { id: true } },
          teacher: { select: { name: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const lessonProgress = await db.lessonProgress.findMany({
    where: { userId: session.user.id },
    select: { lessonId: true },
  });
  const completedIds = new Set(lessonProgress.map((lp) => lp.lessonId));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1e5631]">My Courses</h1>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">You haven&apos;t enrolled in any courses yet.</p>
            <Link href="/courses"><Button>Browse Courses</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {enrollments.map((e) => {
            const done = e.course.lessons.filter((l) => completedIds.has(l.id)).length;
            const total = e.course.lessons.length;
            const pct = calculateProgress(done, total);
            return (
              <Card key={e.courseId} className="hover:shadow-md transition-shadow flex flex-col">
                <CardContent className="flex-1 py-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{SUBJECT_ICONS[e.course.subject] ?? "📚"}</span>
                    {e.completedAt ? (
                      <Badge variant="success">Completed</Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{e.course.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {SUBJECTS[e.course.subject as keyof typeof SUBJECTS]} · Grade {e.course.grade}
                  </p>
                  <Progress value={pct} showLabel className="mb-2" />
                  <p className="text-xs text-gray-400">{done}/{total} lessons</p>
                </CardContent>
                <div className="px-6 pb-4">
                  <Link href={`/courses/${e.courseId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      {pct === 0 ? "Start" : pct === 100 ? "Review" : "Continue"}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
