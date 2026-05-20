"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SUBJECTS, SUBJECT_ICONS, SUBJECT_COLORS, calculateProgress, formatDate } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, BookOpen, Play, Lock, ClipboardList, FileText } from "lucide-react";

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
  submissions: Array<{
    content: string | null;
    fileUrl: string | null;
    grade: number | null;
    feedback: string | null;
    submittedAt: Date;
  }>;
}

interface CourseDetailProps {
  course: {
    id: string;
    title: string;
    description: string;
    subject: string;
    grade: number;
    teacher: { name: string | null; image: string | null };
    lessons: Lesson[];
    assignments: Assignment[];
  };
  enrolled: boolean;
  userId: string;
  completedIds: Set<string>;
}

export function CourseDetail({ course, enrolled, userId, completedIds }: CourseDetailProps) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(enrolled ? course.lessons[0] ?? null : null);
  const [markingDone, setMarkingDone] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(new Set(completedIds));
  const [contentTab, setContentTab] = useState<"lessons" | "assignments">("lessons");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitForm, setSubmitForm] = useState<Record<string, { content: string; fileUrl: string }>>({});
  const [submitError, setSubmitError] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const progress = calculateProgress(
    course.lessons.filter((l) => localCompleted.has(l.id)).length,
    course.lessons.length
  );

  const handleEnroll = async () => {
    setEnrolling(true);
    setEnrollError("");
    const res = await fetch("/api/enroll", {
      method: "POST",
      body: JSON.stringify({ courseId: course.id }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setEnrollError(data.error ?? "Could not enroll");
      setEnrolling(false);
    }
  };

  const handleMarkDone = async (lessonId: string) => {
    if (localCompleted.has(lessonId)) return;
    setMarkingDone(true);
    await fetch("/api/progress", {
      method: "POST",
      body: JSON.stringify({ lessonId }),
      headers: { "Content-Type": "application/json" },
    });
    setLocalCompleted((prev) => new Set([...prev, lessonId]));
    setMarkingDone(false);
    const nextIndex = course.lessons.findIndex((l) => l.id === lessonId) + 1;
    if (nextIndex < course.lessons.length) setActiveLesson(course.lessons[nextIndex]);
  };

  const handleSubmitAssignment = async (assignmentId: string) => {
    const form = submitForm[assignmentId] ?? { content: "", fileUrl: "" };
    if (!form.content && !form.fileUrl) {
      setSubmitError((e) => ({ ...e, [assignmentId]: "Add text or a file URL" }));
      return;
    }
    setSubmitting(assignmentId);
    setSubmitError((e) => ({ ...e, [assignmentId]: "" }));
    const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted((s) => ({ ...s, [assignmentId]: true }));
    } else {
      const data = await res.json().catch(() => ({}));
      setSubmitError((e) => ({ ...e, [assignmentId]: data.error ?? "Submission failed" }));
    }
    setSubmitting(null);
  };

  if (!enrolled) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="rnda-gradient h-32 flex items-end p-6">
            <span className="text-5xl">{SUBJECT_ICONS[course.subject] ?? "📚"}</span>
          </div>
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <Badge className={SUBJECT_COLORS[course.subject] ?? ""}>
                {SUBJECTS[course.subject as keyof typeof SUBJECTS]}
              </Badge>
              <Badge className="bg-gray-100 text-gray-600">Grade {course.grade}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <p className="text-sm text-gray-400 mb-6">By {course.teacher.name}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1"><BookOpen size={14} /> {course.lessons.length} lessons</span>
            </div>
            {enrollError && <p className="text-sm text-red-500 mb-3">{enrollError}</p>}
            <Button loading={enrolling} onClick={handleEnroll} size="lg" className="w-full">
              Enroll Now — It&apos;s Free
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader><h2 className="font-semibold text-gray-800">Course Lessons</h2></CardHeader>
          <CardContent className="py-2">
            {course.lessons.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">{i + 1}</div>
                <span className="flex-1 text-sm text-gray-600">{l.title}</span>
                <Lock size={14} className="text-gray-300" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      <div className="w-full lg:w-72 lg:shrink-0 space-y-4">
        <Card>
          <CardContent className="py-4">
            <h2 className="font-semibold text-[#1e5631] text-sm mb-3">{course.title}</h2>
            <Progress value={progress} showLabel className="mb-2" />
            <p className="text-xs text-gray-400">
              {course.lessons.filter((l) => localCompleted.has(l.id)).length}/{course.lessons.length} lessons done
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setContentTab("lessons")}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${contentTab === "lessons" ? "bg-white text-[#1e5631] shadow-sm" : "text-gray-500"}`}
          >
            Lessons
          </button>
          <button
            onClick={() => setContentTab("assignments")}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 ${contentTab === "assignments" ? "bg-white text-[#1e5631] shadow-sm" : "text-gray-500"}`}
          >
            <ClipboardList size={11} /> Tasks
            {course.assignments.filter((a) => !a.submissions.length).length > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
                {course.assignments.filter((a) => !a.submissions.length).length}
              </span>
            )}
          </button>
        </div>

        {contentTab === "lessons" && (
          <Card>
            <div className="divide-y divide-gray-50">
              {course.lessons.map((l, i) => {
                const done = localCompleted.has(l.id);
                const active = activeLesson?.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLesson(l)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${active ? "bg-[#f0f7eb]" : "hover:bg-gray-50"}`}
                  >
                    {done ? <CheckCircle2 size={16} className="text-[#6db33f] shrink-0" /> : <Circle size={16} className={`shrink-0 ${active ? "text-[#6db33f]" : "text-gray-300"}`} />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${active ? "text-[#1e5631]" : "text-gray-600"}`}>{i + 1}. {l.title}</p>
                      {l.duration && <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {l.duration} min</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {contentTab === "assignments" && (
          <div className="space-y-2">
            {course.assignments.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No assignments yet.</p>
            )}
            {course.assignments.map((a) => {
              const sub = a.submissions[0];
              const isOverdue = new Date(a.dueDate) < new Date();
              return (
                <button
                  key={a.id}
                  onClick={() => { setActiveLesson(null); setContentTab("assignments"); }}
                  className="w-full text-left bg-white border border-gray-100 rounded-xl p-3 hover:border-[#6db33f] transition-colors"
                >
                  <p className="text-xs font-medium text-gray-800 truncate">{a.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={9} /> {formatDate(a.dueDate)}
                    {isOverdue && !sub && <span className="text-red-500"> · Overdue</span>}
                  </p>
                  {sub ? (
                    <span className="text-[10px] text-[#6db33f]">{sub.grade !== null ? `Graded: ${sub.grade}/${a.maxScore}` : "✓ Submitted"}</span>
                  ) : (
                    <span className="text-[10px] text-amber-600">Pending submission</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-4 w-full">
        {contentTab === "assignments" ? (
          course.assignments.map((a) => {
            const sub = a.submissions[0] ?? submitted[a.id];
            const alreadySubmitted = !!a.submissions[0] || submitted[a.id];
            const form = submitForm[a.id] ?? { content: "", fileUrl: "" };
            const isOverdue = new Date(a.dueDate) < new Date();
            return (
              <Card key={a.id}>
                <CardContent className="py-5">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-900">{a.title}</h2>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> Due {formatDate(a.dueDate)}</p>
                      {isOverdue && !alreadySubmitted && <p className="text-xs text-red-500">Overdue</p>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{a.description}</p>
                  <p className="text-xs text-gray-400 mb-4">Max score: {a.maxScore} points</p>

                  {a.submissions[0] ? (
                    <div className="bg-[#f0f7eb] rounded-xl p-4">
                      <p className="text-xs font-semibold text-[#1e5631] mb-1">Your submission ({formatDate(a.submissions[0].submittedAt)})</p>
                      {a.submissions[0].content && <p className="text-sm text-gray-700 whitespace-pre-wrap">{a.submissions[0].content}</p>}
                      {a.submissions[0].fileUrl && <a href={a.submissions[0].fileUrl} className="text-xs text-blue-500 hover:underline">View attached file</a>}
                      {a.submissions[0].grade !== null && (
                        <div className="mt-3 pt-3 border-t border-[#6db33f]/20">
                          <p className="text-sm font-bold text-[#1e5631]">Grade: {a.submissions[0].grade}/{a.maxScore}</p>
                          {a.submissions[0].feedback && <p className="text-xs text-gray-600 mt-1">Feedback: {a.submissions[0].feedback}</p>}
                        </div>
                      )}
                    </div>
                  ) : submitted[a.id] ? (
                    <div className="bg-[#f0f7eb] rounded-xl p-4 text-center">
                      <CheckCircle2 size={24} className="text-[#6db33f] mx-auto mb-1" />
                      <p className="text-sm text-[#1e5631] font-medium">Submitted! Your teacher will grade it soon.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Textarea
                        label="Your answer"
                        placeholder="Type your response here..."
                        value={form.content}
                        onChange={(e) => setSubmitForm((f) => ({ ...f, [a.id]: { ...f[a.id] ?? { content: "", fileUrl: "" }, content: e.target.value } }))}
                        className="min-h-[120px]"
                      />
                      <Input
                        label="Or attach a file URL (Google Drive, Dropbox, etc.)"
                        placeholder="https://..."
                        value={form.fileUrl}
                        onChange={(e) => setSubmitForm((f) => ({ ...f, [a.id]: { ...f[a.id] ?? { content: "", fileUrl: "" }, fileUrl: e.target.value } }))}
                      />
                      {submitError[a.id] && <p className="text-sm text-red-500">{submitError[a.id]}</p>}
                      <Button
                        loading={submitting === a.id}
                        onClick={() => handleSubmitAssignment(a.id)}
                      >
                        Submit Assignment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : activeLesson ? (
          <div className="space-y-4">
            {activeLesson.videoUrl && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen title={activeLesson.title} />
              </div>
            )}

            <Card>
              <CardContent className="py-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{activeLesson.title}</h2>
                  {localCompleted.has(activeLesson.id) ? (
                    <Badge variant="success"><CheckCircle2 size={12} className="mr-1" /> Completed</Badge>
                  ) : (
                    <Button size="sm" loading={markingDone} onClick={() => handleMarkDone(activeLesson.id)}>
                      <Play size={14} /> Mark as Done
                    </Button>
                  )}
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{activeLesson.content}</div>
                {activeLesson.resourceUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={activeLesson.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#1e5631] bg-[#f0f7eb] hover:bg-[#d8efc5] px-4 py-2 rounded-xl transition-colors font-medium"
                    >
                      <FileText size={16} /> Download Resource / PDF
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-gray-400">Select a lesson to start learning</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
