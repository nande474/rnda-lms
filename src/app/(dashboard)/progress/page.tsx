import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { calculateProgress, SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { CheckCircle2, TrendingUp } from "lucide-react";

export default async function ProgressPage() {
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
  });

  const lessonProgress = await db.lessonProgress.findMany({
    where: { userId: session.user.id },
    select: { lessonId: true },
  });

  const completedIds = new Set(lessonProgress.map((lp) => lp.lessonId));
  const quizAttempts = await db.quizAttempt.findMany({
    where: { userId: session.user.id },
    include: { quiz: { select: { title: true, courseId: true } } },
    orderBy: { completedAt: "desc" },
  });

  const overallCompleted = enrollments.reduce(
    (s, e) => s + e.course.lessons.filter((l) => completedIds.has(l.id)).length,
    0
  );
  const overallTotal = enrollments.reduce((s, e) => s + e.course.lessons.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">My Progress</h1>
        <p className="text-gray-500 text-sm mt-1">Track your learning journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Courses Enrolled", value: enrollments.length },
          { label: "Lessons Completed", value: `${overallCompleted}/${overallTotal}` },
          { label: "Quizzes Taken", value: quizAttempts.length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="py-5 flex items-center gap-4">
              <TrendingUp size={22} className="text-[#6db33f]" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Course Progress</h2>
        <div className="space-y-3">
          {enrollments.map((e) => {
            const done = e.course.lessons.filter((l) => completedIds.has(l.id)).length;
            const total = e.course.lessons.length;
            const pct = calculateProgress(done, total);
            return (
              <Card key={e.courseId}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{SUBJECT_ICONS[e.course.subject] ?? "📚"}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm">{e.course.title}</h3>
                        {e.completedAt && (
                          <Badge variant="success">
                            <CheckCircle2 size={10} className="mr-1" /> Done
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {SUBJECTS[e.course.subject as keyof typeof SUBJECTS]} · Grade {e.course.grade}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#6db33f]">{pct}%</span>
                  </div>
                  <Progress value={pct} />
                  <p className="text-xs text-gray-400 mt-1">{done} of {total} lessons completed</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {quizAttempts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Quiz History</h2>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Quiz</th>
                    <th className="px-6 py-3 text-left">Score</th>
                    <th className="px-6 py-3 text-left">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {quizAttempts.map((a) => {
                    const pct = Math.round((a.score / a.maxScore) * 100);
                    return (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-800">{a.quiz.title}</td>
                        <td className="px-6 py-3 text-gray-600">{a.score}/{a.maxScore}</td>
                        <td className="px-6 py-3">
                          <Badge variant={pct >= 70 ? "success" : pct >= 50 ? "warning" : "danger"}>
                            {pct}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
