"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookMarked, TrendingUp } from "lucide-react";

interface Submission { userId: string; grade: number | null }
interface QuizAttempt { userId: string; score: number; maxScore: number }
interface Assignment  { id: string; title: string; maxScore: number; weight: number; submissions: Submission[] }
interface Quiz        { id: string; title: string; attempts: QuizAttempt[] }
interface Student     { id: string; name: string | null; email: string }
interface Course {
  id: string;
  title: string;
  grade: number;
  assignments: Assignment[];
  quizzes:     Quiz[];
}

function gradeColor(pct: number | null) {
  if (pct === null) return "text-gray-400";
  if (pct >= 75) return "text-[#1e5631] font-bold";
  if (pct >= 50) return "text-amber-600 font-semibold";
  return "text-red-600 font-semibold";
}

function gradeSymbol(pct: number | null) {
  if (pct === null) return "—";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

export function TeacherGradebook({
  courses,
  studentsByCourse,
}: {
  courses: Course[];
  studentsByCourse: Record<string, Student[]>;
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? "");
  const course = courses.find((c) => c.id === selectedCourseId);

  if (!course) {
    return (
      <div className="text-center py-24 text-gray-400">
        <BookMarked size={40} className="mx-auto mb-3 opacity-40" />
        <p>No courses found. Create a course first.</p>
      </div>
    );
  }

  const columns = [
    ...course.assignments.map((a) => ({ id: a.id, title: a.title, type: "assignment" as const, maxScore: a.maxScore, weight: a.weight })),
    ...course.quizzes.map((q)     => ({ id: q.id, title: q.title, type: "quiz" as const,       maxScore: 100,        weight: 0.5 })),
  ];

  const students = studentsByCourse[course.id] ?? [];

  const getScore = (student: Student, col: typeof columns[0]) => {
    if (col.type === "assignment") {
      const sub = course.assignments.find((a) => a.id === col.id)?.submissions.find((s) => s.userId === student.id);
      return sub?.grade ?? null;
    } else {
      const attempts = course.quizzes.find((q) => q.id === col.id)?.attempts.filter((a) => a.userId === student.id) ?? [];
      if (!attempts.length) return null;
      const best = attempts.reduce((a, b) => a.score > b.score ? a : b);
      return Math.round((best.score / best.maxScore) * 100);
    }
  };

  const getAverage = (student: Student) => {
    const graded = columns.filter((col) => getScore(student, col) !== null);
    if (!graded.length) return null;
    const weightedSum = graded.reduce((s, col) => {
      const score = getScore(student, col)!;
      const pct   = col.type === "quiz" ? score : (score / col.maxScore) * 100;
      return s + pct * col.weight;
    }, 0);
    const totalWeight = graded.reduce((s, col) => s + col.weight, 0);
    return Math.round(weightedSum / totalWeight);
  };

  const classAvg = () => {
    const avgs = students.map(getAverage).filter((a) => a !== null) as number[];
    return avgs.length ? Math.round(avgs.reduce((s, a) => s + a, 0) / avgs.length) : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e5631] flex items-center gap-2"><BookMarked size={22} /> Gradebook</h1>
          <p className="text-gray-500 text-sm mt-1">Weighted averages across assignments and quizzes</p>
        </div>
        <div className="flex items-center gap-3">
          {classAvg() !== null && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Class average</p>
              <p className={`text-xl ${gradeColor(classAvg())}`}>{classAvg()}% <span className="text-sm">{gradeSymbol(classAvg())}</span></p>
            </div>
          )}
          <Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            options={courses.map((c) => ({ value: c.id, label: `${c.title} (Grade ${c.grade})` }))}
            className="w-56"
          />
        </div>
      </div>

      {students.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-gray-400">No students enrolled in this course yet.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left sticky left-0 bg-white z-10">Student</th>
                    {columns.map((col) => (
                      <th key={col.id} className="px-4 py-3 text-center min-w-[100px]">
                        <div className="flex flex-col items-center gap-1">
                          <span className="truncate max-w-[90px] block normal-case font-medium text-gray-700">{col.title}</span>
                          <Badge className={col.type === "quiz" ? "bg-purple-100 text-purple-700 text-[9px]" : "bg-blue-100 text-blue-700 text-[9px]"}>
                            {col.type === "quiz" ? "Quiz" : `/${col.maxScore}`}
                          </Badge>
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center sticky right-0 bg-white z-10">
                      <div className="flex items-center gap-1 justify-center"><TrendingUp size={12} /> Average</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((student) => {
                    const avg = getAverage(student);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 sticky left-0 bg-white">
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-400">{student.email}</p>
                        </td>
                        {columns.map((col) => {
                          const score = getScore(student, col);
                          const pct = score === null ? null : col.type === "quiz" ? score : Math.round((score / col.maxScore) * 100);
                          return (
                            <td key={col.id} className={`px-4 py-3 text-center ${gradeColor(pct)}`}>
                              {score === null ? <span className="text-gray-300 text-xs">—</span> : (
                                <div>
                                  <span>{col.type === "quiz" ? `${score}%` : `${score}/${col.maxScore}`}</span>
                                  <p className="text-[10px] text-gray-400">{pct}%</p>
                                </div>
                              )}
                            </td>
                          );
                        })}
                        <td className={`px-4 py-3 text-center sticky right-0 bg-white ${gradeColor(avg)}`}>
                          {avg !== null ? (
                            <div>
                              <p className="text-base">{avg}%</p>
                              <p className="text-xs text-gray-500">{gradeSymbol(avg)}</p>
                            </div>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
