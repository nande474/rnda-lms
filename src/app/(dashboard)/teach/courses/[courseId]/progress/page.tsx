import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, BookOpen, Award, AlertTriangle } from "lucide-react";
import { SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";

export default async function ClassProgressPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") redirect("/dashboard");

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: { orderBy: { order: "asc" } },
      lessons:  { orderBy: { order: "asc" } },
      enrollments: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { enrolledAt: "asc" },
      },
    },
  });

  if (!course) notFound();
  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPERADMIN" &&
    course.teacherId !== session.user.id
  ) {
    redirect("/dashboard");
  }

  // Build ordered lesson list: section lessons first (in section order), then unsectioned
  const orderedLessons: Array<{ id: string; title: string; order: number; sectionId: string | null; sectionName: string }> = [
    ...course.sections.flatMap((s) =>
      course.lessons
        .filter((l) => l.sectionId === s.id)
        .map((l) => ({ id: l.id, title: l.title, order: l.order, sectionId: s.id, sectionName: s.name }))
    ),
    ...course.lessons
      .filter((l) => !l.sectionId)
      .map((l) => ({ id: l.id, title: l.title, order: l.order, sectionId: null, sectionName: "Uncategorized" })),
  ];

  const totalLessons = orderedLessons.length;

  // Fetch all progress records for lessons in this course
  const progressRecords = await db.lessonProgress.findMany({
    where:  { lessonId: { in: orderedLessons.map((l) => l.id) } },
    select: { userId: true, lessonId: true, completedAt: true },
  });

  // Build lookup: userId → Map<lessonId, completedAt>
  const progressMap = new Map<string, Map<string, Date>>();
  for (const p of progressRecords) {
    if (!progressMap.has(p.userId)) progressMap.set(p.userId, new Map());
    progressMap.get(p.userId)!.set(p.lessonId, p.completedAt);
  }

  // Build student rows with computed stats, sorted by completion % descending
  const students = course.enrollments
    .map((e) => {
      const lessonMap = progressMap.get(e.user.id) ?? new Map<string, Date>();
      const completedCount = lessonMap.size;
      const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      const dates = [...lessonMap.values()].sort((a, b) => b.getTime() - a.getTime());
      const lastActive: Date | null = dates[0] ?? null;
      return { ...e.user, completedCount, pct, lastActive, lessonMap };
    })
    .sort((a, b) => b.pct - a.pct);

  // Per-lesson completion counts (for footer row)
  const lessonDoneCount = new Map<string, number>();
  for (const s of students) {
    for (const lid of s.lessonMap.keys()) {
      lessonDoneCount.set(lid, (lessonDoneCount.get(lid) ?? 0) + 1);
    }
  }

  const avgCompletion =
    students.length > 0
      ? Math.round(students.reduce((s, r) => s + r.pct, 0) / students.length)
      : 0;
  const completedCourse = students.filter((s) => s.pct === 100).length;
  const notStarted      = students.filter((s) => s.pct === 0).length;

  // Build section column groups for the header row
  const sectionGroups: Array<{ name: string; count: number }> = [];
  for (const lesson of orderedLessons) {
    const last = sectionGroups[sectionGroups.length - 1];
    if (last && last.name === lesson.sectionName) {
      last.count++;
    } else {
      sectionGroups.push({ name: lesson.sectionName, count: 1 });
    }
  }

  const formatRelative = (date: Date | null): string => {
    if (!date) return "Never";
    const days = Math.floor((Date.now() - date.getTime()) / 864e5);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7)  return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div className="space-y-6">
      {/* Back + title */}
      <div>
        <Link
          href={`/teach/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1e5631] mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back to course editor
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{SUBJECT_ICONS[course.subject] ?? "📚"}</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1e5631]">Class Progress</h1>
            <p className="text-gray-500 text-sm">
              {course.title} · {SUBJECTS[course.subject as keyof typeof SUBJECTS] ?? course.subject} · Grade {course.grade}
            </p>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Users size={17} className="text-[#6db33f]" />,          label: "Enrolled",         value: students.length,   bg: "bg-[#f0f7eb]" },
          { icon: <BookOpen size={17} className="text-blue-600" />,         label: "Avg Completion",   value: `${avgCompletion}%`, bg: "bg-blue-50"   },
          { icon: <Award size={17} className="text-amber-600" />,           label: "Finished Course",  value: completedCourse,   bg: "bg-amber-50"  },
          { icon: <AlertTriangle size={17} className="text-red-500" />,     label: "Not Started",      value: notStarted,        bg: "bg-red-50"    },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 py-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-[11px] text-gray-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#6db33f] inline-block" /> Lesson completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-gray-200 inline-block" /> Not yet done
        </span>
        <span className="flex items-center gap-1.5">
          Sorted by completion ↓
        </span>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No students enrolled yet.</p>
          </CardContent>
        </Card>
      ) : totalLessons === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No lessons in this course yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                {/* Section group row */}
                <tr className="bg-gray-50">
                  <th
                    className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide min-w-[200px] border-b border-r border-gray-200"
                  >
                    Student
                  </th>
                  {sectionGroups.map((g, gi) => (
                    <th
                      key={gi}
                      colSpan={g.count}
                      className="px-2 py-2.5 text-center text-[11px] font-semibold text-gray-500 border-b border-r border-gray-200 last:border-r-0"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6db33f] shrink-0" />
                        {g.name}
                      </span>
                    </th>
                  ))}
                  <th className="bg-gray-50 px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-l border-gray-200 min-w-[60px]">
                    Done
                  </th>
                  <th className="bg-gray-50 px-3 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 min-w-[90px] whitespace-nowrap">
                    Last Active
                  </th>
                </tr>

                {/* Lesson label row */}
                <tr className="bg-white">
                  <th className="sticky left-0 z-10 bg-white px-4 py-2 text-[10px] text-gray-400 font-normal text-left border-b border-r border-gray-100">
                    {totalLessons} lessons
                  </th>
                  {orderedLessons.map((l, i) => (
                    <th key={l.id} className="px-1 py-2 text-center border-b border-gray-100">
                      <span className="text-[10px] text-gray-400 font-normal" title={l.title}>
                        L{i + 1}
                      </span>
                    </th>
                  ))}
                  <th colSpan={2} className="border-b border-gray-100" />
                </tr>
              </thead>

              <tbody>
                {students.map((student, si) => {
                  const evenBg = si % 2 === 0 ? "bg-white" : "bg-gray-50/40";
                  const isComplete   = student.pct === 100;
                  const isNotStarted = student.pct === 0;

                  return (
                    <tr key={student.id} className={`${evenBg} hover:bg-emerald-50/40 transition-colors group`}>
                      {/* Student cell (sticky) */}
                      <td className={`sticky left-0 z-10 ${evenBg} group-hover:bg-emerald-50/40 px-4 py-3 border-b border-r border-gray-100`}>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                            style={{ background: isComplete ? "#6db33f" : isNotStarted ? "#dc2626" : "#1e5631" }}
                          >
                            {student.name?.charAt(0).toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 text-xs truncate max-w-[130px]">
                              {student.name ?? student.email}
                            </p>
                            {isComplete && (
                              <span className="text-[9px] font-semibold text-[#6db33f]">✓ Finished</span>
                            )}
                            {isNotStarted && (
                              <span className="text-[9px] font-semibold text-red-500">Not started</span>
                            )}
                            {!isComplete && !isNotStarted && (
                              <span className="text-[9px] text-gray-400">{student.completedCount}/{totalLessons} lessons</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Lesson completion dots */}
                      {orderedLessons.map((lesson) => {
                        const done = student.lessonMap.has(lesson.id);
                        return (
                          <td key={lesson.id} className="px-1 py-3 text-center border-b border-gray-100">
                            <div
                              className="w-4 h-4 rounded-full mx-auto transition-transform group-hover:scale-110"
                              style={{
                                background:  done ? "#6db33f" : "#e5e7eb",
                                boxShadow:   done ? "0 1px 4px rgba(109,179,63,0.4)" : "none",
                              }}
                              title={`${student.name ?? "Student"} — ${lesson.title}: ${done ? "Completed" : "Not done"}`}
                            />
                          </td>
                        );
                      })}

                      {/* % done */}
                      <td className="px-3 py-3 text-right border-b border-l border-gray-100">
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            student.pct >= 80 ? "text-[#6db33f]"  :
                            student.pct >= 50 ? "text-amber-600"  :
                            student.pct >  0  ? "text-orange-500" :
                                                "text-red-400"
                          }`}
                        >
                          {student.pct}%
                        </span>
                      </td>

                      {/* Last active */}
                      <td className="px-3 py-3 text-right border-b border-gray-100 text-[11px] text-gray-400 whitespace-nowrap">
                        {formatRelative(student.lastActive)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Footer: per-lesson % */}
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td className="sticky left-0 z-10 bg-gray-50 px-4 py-2.5 text-[11px] text-gray-500 font-semibold border-r border-gray-200">
                    % of class done
                  </td>
                  {orderedLessons.map((lesson) => {
                    const count = lessonDoneCount.get(lesson.id) ?? 0;
                    const pct   = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                    return (
                      <td key={lesson.id} className="px-1 py-2.5 text-center">
                        <span
                          className={`text-[10px] font-semibold tabular-nums ${
                            pct >= 70 ? "text-[#6db33f]" :
                            pct >= 30 ? "text-amber-500" :
                                        "text-gray-400"
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2.5 text-right text-[11px] font-bold text-[#1e5631] border-l border-gray-200" colSpan={2}>
                    {avgCompletion}% avg
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
