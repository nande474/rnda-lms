"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { Plus, BookOpen, Users, Eye, EyeOff, GripVertical, Trash2, ClipboardList, CheckCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  resourceUrl: string | null;
  order: number;
  duration: number | null;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  weight: number;
  submissions: Array<{
    userId: string;
    grade: number | null;
    submittedAt: Date;
    content: string | null;
    fileUrl: string | null;
    feedback: string | null;
    user: { name: string | null; email: string };
  }>;
}

interface CourseEditorProps {
  course: {
    id: string;
    title: string;
    description: string;
    subject: string;
    grade: number;
    published: boolean;
    lessons: Lesson[];
    assignments: Assignment[];
    enrollments: Array<{ user: { name: string | null; email: string; image: string | null } }>;
  };
}

export function CourseEditor({ course: initial }: CourseEditorProps) {
  const [course, setCourse] = useState(initial);
  const [lessons, setLessons] = useState(initial.lessons);
  const [assignments, setAssignments] = useState<Assignment[]>(initial.assignments);
  const [showNewLesson, setShowNewLesson] = useState(false);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"lessons" | "assignments" | "students">("lessons");
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState<Record<string, { grade: string; feedback: string }>>({});
  const [gradeError, setGradeError] = useState<Record<string, string>>({});

  const [newLesson, setNewLesson] = useState({ title: "", content: "", videoUrl: "", resourceUrl: "", duration: "" });
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", dueDate: "", maxScore: "100", weight: "1" });

  const togglePublish = async () => {
    setSaving(true);
    const res = await fetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !course.published }),
    });
    if (res.ok) setCourse((c) => ({ ...c, published: !c.published }));
    setSaving(false);
  };

  const addLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/courses/${course.id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLesson),
    });
    if (res.ok) {
      const { lesson } = await res.json();
      setLessons((prev) => [...prev, lesson]);
      setNewLesson({ title: "", content: "", videoUrl: "", resourceUrl: "", duration: "" });
      setShowNewLesson(false);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
  };

  const addAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newAssignment, courseId: course.id }),
    });
    if (res.ok) {
      const { assignment } = await res.json();
      setAssignments((prev) => [...prev, { ...assignment, submissions: [] }]);
      setNewAssignment({ title: "", description: "", dueDate: "", maxScore: "100", weight: "1" });
      setShowNewAssignment(false);
    }
  };

  const submitGrade = async (assignmentId: string, userId: string) => {
    const key = `${assignmentId}-${userId}`;
    const form = gradeForm[key] ?? { grade: "", feedback: "" };
    setGradeError((e) => ({ ...e, [key]: "" }));
    const res = await fetch(`/api/assignments/${assignmentId}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, grade: Number(form.grade), feedback: form.feedback }),
    });
    if (res.ok) {
      const { submission } = await res.json();
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId
            ? { ...a, submissions: a.submissions.map((s) => (s.userId === userId ? { ...s, ...submission } : s)) }
            : a
        )
      );
      setGradingId(null);
    } else {
      const data = await res.json().catch(() => ({}));
      setGradeError((e) => ({ ...e, [key]: data.error ?? "Failed to save grade" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{SUBJECT_ICONS[course.subject] ?? "📚"}</span>
            <h1 className="text-2xl font-bold text-[#1e5631]">{course.title}</h1>
            <Badge variant={course.published ? "success" : "warning"}>
              {course.published ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="text-gray-500 text-sm">
            {SUBJECTS[course.subject as keyof typeof SUBJECTS]} · Grade {course.grade}
          </p>
        </div>
        <Button variant={course.published ? "outline" : "primary"} loading={saving} onClick={togglePublish}>
          {course.published ? <><EyeOff size={16} /> Unpublish</> : <><Eye size={16} /> Publish</>}
        </Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {(["lessons", "assignments", "students"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? "border-[#6db33f] text-[#6db33f]" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t === "lessons" && <span className="flex items-center gap-1.5"><BookOpen size={14} /> Lessons ({lessons.length})</span>}
            {t === "assignments" && <span className="flex items-center gap-1.5"><ClipboardList size={14} /> Assignments ({assignments.length})</span>}
            {t === "students" && <span className="flex items-center gap-1.5"><Users size={14} /> Students ({course.enrollments.length})</span>}
          </button>
        ))}
      </div>

      {tab === "lessons" && (
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <Card key={lesson.id}>
              <CardContent className="py-3 flex items-center gap-3">
                <GripVertical size={16} className="text-gray-300" />
                <div className="w-7 h-7 rounded-full bg-[#f0f7eb] flex items-center justify-center text-xs font-medium text-[#1e5631]">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-gray-400 truncate">{lesson.content.slice(0, 60)}…</p>
                    {lesson.videoUrl && <span className="text-xs text-blue-500">▶ Video</span>}
                    {lesson.resourceUrl && <span className="text-xs text-orange-500">📄 Resource</span>}
                  </div>
                </div>
                {lesson.duration && <span className="text-xs text-gray-400">{lesson.duration} min</span>}
                <button onClick={() => deleteLesson(lesson.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </CardContent>
            </Card>
          ))}

          {showNewLesson ? (
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-800 text-sm">New Lesson</h3></CardHeader>
              <CardContent>
                <form onSubmit={addLesson} className="space-y-3">
                  <Input label="Title" value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} required />
                  <Textarea label="Content" value={newLesson.content} onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })} required className="min-h-[150px]" />
                  <Input label="Video URL (YouTube/Vimeo embed, optional)" placeholder="https://www.youtube.com/embed/..." value={newLesson.videoUrl} onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })} />
                  <Input label="Resource URL (PDF or document link, optional)" placeholder="https://..." value={newLesson.resourceUrl} onChange={(e) => setNewLesson({ ...newLesson, resourceUrl: e.target.value })} />
                  <Input label="Duration (minutes, optional)" type="number" value={newLesson.duration} onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })} />
                  <div className="flex gap-2">
                    <Button type="submit">Add Lesson</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowNewLesson(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <button onClick={() => setShowNewLesson(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#6db33f] hover:text-[#6db33f] transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Add Lesson
            </button>
          )}
        </div>
      )}

      {tab === "assignments" && (
        <div className="space-y-4">
          {assignments.map((a) => {
            const submitted = a.submissions.length;
            const graded = a.submissions.filter((s) => s.grade !== null).length;
            const isOverdue = new Date(a.dueDate) < new Date();
            return (
              <Card key={a.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{a.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <Clock size={11} />
                        Due {formatDate(a.dueDate)}
                        {isOverdue && <span className="text-red-500 ml-1">(overdue)</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Max: {a.maxScore} pts · Weight: {a.weight}×</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span>{submitted} / {course.enrollments.length} submitted</span>
                    <span>{graded} graded</span>
                  </div>
                  {a.submissions.length > 0 && (
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <th className="px-4 py-2 text-left">Student</th>
                            <th className="px-4 py-2 text-left">Submitted</th>
                            <th className="px-4 py-2 text-left">Grade</th>
                            <th className="px-4 py-2 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {a.submissions.map((s) => {
                            const key = `${a.id}-${s.userId}`;
                            const isGrading = gradingId === key;
                            return (
                              <tr key={s.userId}>
                                <td className="px-4 py-2">
                                  <p className="font-medium text-gray-800">{s.user.name}</p>
                                  <p className="text-xs text-gray-400">{s.user.email}</p>
                                  {s.content && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.content}</p>}
                                  {s.fileUrl && <a href={s.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">View file</a>}
                                </td>
                                <td className="px-4 py-2 text-xs text-gray-500">{formatDate(s.submittedAt)}</td>
                                <td className="px-4 py-2">
                                  {s.grade !== null ? (
                                    <div>
                                      <span className="font-semibold text-[#1e5631]">{s.grade}/{a.maxScore}</span>
                                      {s.feedback && <p className="text-xs text-gray-400 mt-0.5">{s.feedback}</p>}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-amber-600">Pending</span>
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {isGrading ? (
                                    <div className="space-y-1.5">
                                      <Input
                                        type="number"
                                        placeholder={`0-${a.maxScore}`}
                                        value={gradeForm[key]?.grade ?? ""}
                                        onChange={(e) => setGradeForm((f) => ({ ...f, [key]: { ...f[key], grade: e.target.value } }))}
                                        className="w-24 text-xs py-1"
                                      />
                                      <Input
                                        placeholder="Feedback (optional)"
                                        value={gradeForm[key]?.feedback ?? ""}
                                        onChange={(e) => setGradeForm((f) => ({ ...f, [key]: { ...f[key], feedback: e.target.value } }))}
                                        className="text-xs py-1"
                                      />
                                      {gradeError[key] && <p className="text-xs text-red-500">{gradeError[key]}</p>}
                                      <div className="flex gap-1">
                                        <Button size="sm" onClick={() => submitGrade(a.id, s.userId)} className="text-xs py-1">Save</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setGradingId(null)} className="text-xs py-1">Cancel</Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => { setGradingId(key); setGradeForm((f) => ({ ...f, [key]: { grade: String(s.grade ?? ""), feedback: s.feedback ?? "" } })); }}
                                      className="text-xs text-[#6db33f] hover:underline flex items-center gap-1"
                                    >
                                      <CheckCircle size={12} /> {s.grade !== null ? "Edit grade" : "Grade"}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {showNewAssignment ? (
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-800 text-sm">New Assignment</h3></CardHeader>
              <CardContent>
                <form onSubmit={addAssignment} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Input label="Title" value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} required />
                  </div>
                  <div className="sm:col-span-2">
                    <Textarea label="Description / Instructions" value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} className="min-h-[80px]" />
                  </div>
                  <Input label="Due date" type="datetime-local" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} required />
                  <Input label="Max score" type="number" value={newAssignment.maxScore} onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: e.target.value })} />
                  <Input label="Weight (for gradebook)" type="number" step="0.1" value={newAssignment.weight} onChange={(e) => setNewAssignment({ ...newAssignment, weight: e.target.value })} />
                  <div className="sm:col-span-2 flex gap-2">
                    <Button type="submit">Create Assignment</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowNewAssignment(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <button onClick={() => setShowNewAssignment(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#6db33f] hover:text-[#6db33f] transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> New Assignment
            </button>
          )}
        </div>
      )}

      {tab === "students" && (
        <Card>
          <CardContent className="py-2">
            {course.enrollments.length === 0 ? (
              <p className="py-8 text-center text-gray-400 text-sm">No students enrolled yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {course.enrollments.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className="w-8 h-8 rounded-full bg-[#6db33f] flex items-center justify-center text-white text-sm font-bold">
                      {e.user.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{e.user.name}</p>
                      <p className="text-xs text-gray-500">{e.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
