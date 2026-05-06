import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { Plus, Users, BookOpen, Eye } from "lucide-react";

interface Course {
  id: string;
  title: string;
  subject: string;
  grade: number;
  published: boolean;
  lessons: Array<{ id: string }>;
  enrollments: Array<{ id: string }>;
}

interface TeacherDashboardProps {
  courses: Course[];
}

export function TeacherDashboard({ courses }: TeacherDashboardProps) {
  const published = courses.filter((c) => c.published);
  const totalStudents = courses.reduce((s, c) => s + c.enrollments.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e5631]">Teaching Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your STEM courses</p>
        </div>
        <Link href="/teach/courses/new">
          <Button>
            <Plus size={16} /> New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Courses", value: courses.length, icon: <BookOpen size={20} className="text-[#6db33f]" />, bg: "bg-[#f0f7eb]" },
          { label: "Published", value: published.length, icon: <Eye size={20} className="text-blue-600" />, bg: "bg-blue-50" },
          { label: "Total Students", value: totalStudents, icon: <Users size={20} className="text-purple-600" />, bg: "bg-purple-50" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Courses</h2>
        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No courses yet. Create your first one!</p>
              <Link href="/teach/courses/new">
                <Button><Plus size={16} /> Create Course</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex-row items-center justify-between py-3">
                  <span className="text-2xl">{SUBJECT_ICONS[c.subject] ?? "📚"}</span>
                  <Badge variant={c.published ? "success" : "warning"}>
                    {c.published ? "Published" : "Draft"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-gray-800 mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {SUBJECTS[c.subject as keyof typeof SUBJECTS]} · Grade {c.grade}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>{c.lessons.length} lessons</span>
                    <span>{c.enrollments.length} students</span>
                  </div>
                  <Link href={`/teach/courses/${c.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
