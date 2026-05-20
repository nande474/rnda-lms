import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateProgress, SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { BookOpen, Award, TrendingUp, Clock, Flame, BarChart2 } from "lucide-react";

interface StudentDashboardProps {
  user: { name?: string | null; grade: number | null };
  enrollments: Array<{
    courseId: string;
    enrolledAt: Date;
    completedAt: Date | null;
    course: {
      id: string;
      title: string;
      subject: string;
      grade: number;
      lessons: Array<{ id: string }>;
      teacher: { name: string | null };
      assignments: Array<{ submissions: Array<{ grade: number | null }> }>;
    };
  }>;
  completedLessonIds: Set<string>;
  streak: number;
  overallAvg: number | null;
}

function streakColor(streak: number) {
  if (streak >= 7) return "text-orange-500";
  if (streak >= 3) return "text-amber-500";
  return "text-gray-400";
}

export function StudentDashboard({ user, enrollments, completedLessonIds, streak, overallAvg }: StudentDashboardProps) {
  const totalLessons   = enrollments.reduce((s, e) => s + e.course.lessons.length, 0);
  const completedLessons = enrollments.reduce(
    (s, e) => s + e.course.lessons.filter((l) => completedLessonIds.has(l.id)).length,
    0
  );
  const completedCourses = enrollments.filter((e) => e.completedAt !== null).length;

  const pendingAssignments = enrollments.reduce(
    (s, e) => s + e.course.assignments.filter((a) => !a.submissions.length).length,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">
          Hello, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {user.grade ? `Grade ${user.grade} · ` : ""}Keep up the great work!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          {
            label: "Enrolled",
            value: enrollments.length,
            icon: <BookOpen size={18} className="text-[#6db33f]" />,
            bg: "bg-[#f0f7eb]",
          },
          {
            label: "Lessons Done",
            value: `${completedLessons}/${totalLessons}`,
            icon: <TrendingUp size={18} className="text-blue-600" />,
            bg: "bg-blue-50",
          },
          {
            label: "Certificates",
            value: completedCourses,
            icon: <Award size={18} className="text-amber-600" />,
            bg: "bg-amber-50",
          },
          {
            label: "Day Streak",
            value: streak,
            icon: <Flame size={18} className={streakColor(streak)} />,
            bg: streak >= 3 ? "bg-orange-50" : "bg-gray-50",
            suffix: streak === 1 ? " day" : " days",
          },
          {
            label: "Avg Grade",
            value: overallAvg !== null ? `${overallAvg}%` : "—",
            icon: <BarChart2 size={18} className={overallAvg !== null && overallAvg >= 75 ? "text-[#6db33f]" : overallAvg !== null && overallAvg >= 50 ? "text-amber-600" : "text-gray-400"} />,
            bg: "bg-gray-50",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col items-center justify-center py-4 text-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${stat.bg}`}>
                {stat.icon}
              </div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingAssignments > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {pendingAssignments} assignment{pendingAssignments > 1 ? "s" : ""} pending submission
            </p>
            <p className="text-xs text-amber-600">Don't fall behind — complete your work on time.</p>
          </div>
          <Link href="/my-grades">
            <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              View
            </Button>
          </Link>
        </div>
      )}

      {enrollments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.slice(0, 4).map((e) => {
              const done  = e.course.lessons.filter((l) => completedLessonIds.has(l.id)).length;
              const total = e.course.lessons.length;
              const pct   = calculateProgress(done, total);
              return (
                <Card key={e.courseId} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-xl mr-2">{SUBJECT_ICONS[e.course.subject] ?? "📚"}</span>
                        <Badge className="text-[10px] bg-[#f0f7eb] text-[#1e5631]">Grade {e.course.grade}</Badge>
                      </div>
                      {e.completedAt && <Badge variant="success">Completed</Badge>}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{e.course.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {SUBJECTS[e.course.subject as keyof typeof SUBJECTS]} · {e.course.teacher.name}
                    </p>
                    <Progress value={pct} showLabel className="mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {done}/{total} lessons
                      </span>
                      <Link href={`/courses/${e.courseId}`}>
                        <Button size="sm" variant="outline">
                          {pct === 0 ? "Start" : pct === 100 ? "Review" : "Continue"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {enrollments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600 mb-2">No courses yet</h3>
            <p className="text-sm text-gray-400 mb-4">Browse STEM courses for Grade {user.grade ?? "your grade"} and start learning today.</p>
            <Link href="/courses"><Button>Browse Courses</Button></Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
