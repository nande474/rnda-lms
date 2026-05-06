import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateProgress, SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { BookOpen, Award, TrendingUp, Clock } from "lucide-react";

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
    };
  }>;
  completedLessonIds: Set<string>;
}

export function StudentDashboard({ user, enrollments, completedLessonIds }: StudentDashboardProps) {
  const totalLessons = enrollments.reduce((s, e) => s + e.course.lessons.length, 0);
  const completedLessons = enrollments.reduce(
    (s, e) => s + e.course.lessons.filter((l) => completedLessonIds.has(l.id)).length,
    0
  );
  const completedCourses = enrollments.filter((e) => e.completedAt !== null).length;

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Enrolled Courses",
            value: enrollments.length,
            icon: <BookOpen size={20} className="text-[#6db33f]" />,
            bg: "bg-[#f0f7eb]",
          },
          {
            label: "Lessons Completed",
            value: completedLessons,
            icon: <TrendingUp size={20} className="text-blue-600" />,
            bg: "bg-blue-50",
          },
          {
            label: "Certificates Earned",
            value: completedCourses,
            icon: <Award size={20} className="text-amber-600" />,
            bg: "bg-amber-50",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {enrollments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.slice(0, 4).map((e) => {
              const done = e.course.lessons.filter((l) => completedLessonIds.has(l.id)).length;
              const total = e.course.lessons.length;
              const pct = calculateProgress(done, total);
              return (
                <Card key={e.courseId} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-xl mr-2">
                          {SUBJECT_ICONS[e.course.subject] ?? "📚"}
                        </span>
                        <Badge className="text-[10px] bg-[#f0f7eb] text-[#1e5631]">
                          Grade {e.course.grade}
                        </Badge>
                      </div>
                      {e.completedAt && <Badge variant="success">Completed</Badge>}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{e.course.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {SUBJECTS[e.course.subject as keyof typeof SUBJECTS]} ·{" "}
                      {e.course.teacher.name}
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
            <p className="text-sm text-gray-400 mb-4">
              Browse available STEM courses and start learning today.
            </p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
