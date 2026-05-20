"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookMarked, TrendingUp, ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Submission { grade: number | null; feedback: string | null; submittedAt: Date }
interface QuizAttempt { score: number; maxScore: number; completedAt: Date }
interface Assignment  { id: string; title: string; maxScore: number; weight: number; dueDate: Date; submissions: Submission[] }
interface Quiz        { id: string; title: string; attempts: QuizAttempt[] }
interface Course      { id: string; title: string; grade: number; assignments: Assignment[]; quizzes: Quiz[] }

function pct(score: number, max: number) { return Math.round((score / max) * 100); }

function GradeBadge({ value }: { value: number | null }) {
  if (value === null) return <Badge className="bg-gray-100 text-gray-400">Pending</Badge>;
  if (value >= 75) return <Badge variant="success">{value}%</Badge>;
  if (value >= 50) return <Badge className="bg-amber-100 text-amber-700">{value}%</Badge>;
  return <Badge className="bg-red-100 text-red-700">{value}%</Badge>;
}

export function StudentGrades({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <BookMarked size={40} className="mx-auto mb-3 opacity-40" />
        <p>No grades yet. Enroll in a course and complete assignments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631] flex items-center gap-2"><BookMarked size={22} /> My Grades</h1>
        <p className="text-gray-500 text-sm mt-1">Your academic performance across all enrolled courses</p>
      </div>

      {courses.map((course) => {
        const assignmentRows = course.assignments.map((a) => {
          const sub = a.submissions[0];
          const score = sub?.grade ?? null;
          const percentage = score !== null ? pct(score, a.maxScore) : null;
          return { type: "assignment" as const, title: a.title, maxScore: a.maxScore, weight: a.weight, score, percentage, submitted: !!sub, dueDate: a.dueDate, feedback: sub?.feedback ?? null, submittedAt: sub?.submittedAt ?? null };
        });

        const quizRows = course.quizzes.map((q) => {
          const best = q.attempts.reduce((a, b) => a.score > b.score ? a : b, q.attempts[0]);
          const score = best ? pct(best.score, best.maxScore) : null;
          return { type: "quiz" as const, title: q.title, maxScore: 100, weight: 0.5, score, percentage: score, submitted: q.attempts.length > 0, dueDate: null, feedback: null, submittedAt: best?.completedAt ?? null };
        });

        const all = [...assignmentRows, ...quizRows];
        const graded = all.filter((r) => r.percentage !== null);
        const weightedSum = graded.reduce((s, r) => s + r.percentage! * r.weight, 0);
        const totalWeight = graded.reduce((s, r) => s + r.weight, 0);
        const courseAvg = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : null;

        return (
          <Card key={course.id}>
            <CardContent className="py-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>
                  <p className="text-xs text-gray-400">Grade {course.grade}</p>
                </div>
                {courseAvg !== null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1e5631]">{courseAvg}%</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end"><TrendingUp size={11} /> Course average</p>
                  </div>
                )}
              </div>

              {courseAvg !== null && (
                <div className="mb-5">
                  <Progress value={courseAvg} showLabel />
                </div>
              )}

              {all.length === 0 ? (
                <p className="text-sm text-gray-400">No assessments in this course yet.</p>
              ) : (
                <div className="space-y-2">
                  {all.map((row, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.type === "quiz" ? "bg-purple-100" : "bg-blue-100"}`}>
                        <ClipboardList size={16} className={row.type === "quiz" ? "text-purple-600" : "text-blue-600"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{row.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <Badge className={`text-[10px] ${row.type === "quiz" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {row.type === "quiz" ? "Quiz" : "Assignment"}
                          </Badge>
                          {row.dueDate && <span className="text-[10px] text-gray-400">Due {formatDate(row.dueDate)}</span>}
                          {row.submittedAt && <span className="text-[10px] text-gray-400">Submitted {formatDate(row.submittedAt)}</span>}
                        </div>
                        {row.feedback && <p className="text-xs text-gray-500 mt-1 italic">"{row.feedback}"</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <GradeBadge value={row.percentage} />
                        {row.score !== null && row.type === "assignment" && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{row.score}/{row.maxScore}</p>
                        )}
                        {!row.submitted && <span className="text-[10px] text-amber-600">Not submitted</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
