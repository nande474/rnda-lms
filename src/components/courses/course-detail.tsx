"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SUBJECTS, SUBJECT_ICONS, SUBJECT_COLORS, calculateProgress, formatDate } from "@/lib/utils";
import {
  CheckCircle2, Clock, BookOpen, Play, Lock, ClipboardList,
  FileText, ChevronRight, Folder, ArrowRight,
} from "lucide-react";

interface Section { id: string; name: string; order: number }
interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  resourceUrl: string | null;
  order: number;
  sectionId?: string | null;
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
    sections: Section[];
    lessons: Lesson[];
    assignments: Assignment[];
  };
  enrolled: boolean;
  userId: string;
  completedIds: Set<string>;
}

type LessonState = "completed" | "current" | "upcoming";

function getLessonState(lesson: Lesson, index: number, completedIds: Set<string>, firstIncompleteIndex: number): LessonState {
  if (completedIds.has(lesson.id)) return "completed";
  if (index === firstIncompleteIndex) return "current";
  return "upcoming";
}

export function CourseDetail({ course, enrolled, userId, completedIds }: CourseDetailProps) {
  const router = useRouter();
  const [enrolling, setEnrolling]       = useState(false);
  const [enrollError, setEnrollError]   = useState("");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(() => {
    if (!enrolled) return null;
    const first = course.lessons.find((l) => !completedIds.has(l.id)) ?? course.lessons[0] ?? null;
    return first;
  });
  const [markingDone, setMarkingDone]   = useState(false);
  const [localCompleted, setLocalCompleted] = useState(new Set(completedIds));
  const [showAssignments, setShowAssignments] = useState(false);
  const [submitting, setSubmitting]     = useState<string | null>(null);
  const [submitForm, setSubmitForm]     = useState<Record<string, { content: string; fileUrl: string }>>({});
  const [submitError, setSubmitError]   = useState<Record<string, string>>({});
  const [submitted, setSubmitted]       = useState<Record<string, boolean>>({});

  const completedCount = course.lessons.filter((l) => localCompleted.has(l.id)).length;
  const progress = calculateProgress(completedCount, course.lessons.length);
  const firstIncompleteIndex = course.lessons.findIndex((l) => !localCompleted.has(l.id));
  const nextLesson = firstIncompleteIndex >= 0 ? course.lessons[firstIncompleteIndex] : null;
  const courseComplete = completedCount === course.lessons.length && course.lessons.length > 0;

  // Group lessons by section
  const sectionGroups: Array<{ section: Section | null; lessons: Lesson[] }> = [];
  if (course.sections.length === 0) {
    sectionGroups.push({ section: null, lessons: course.lessons });
  } else {
    for (const section of course.sections) {
      const sectionLessons = course.lessons.filter((l) => (l as Lesson & { sectionId?: string | null }).sectionId === section.id);
      if (sectionLessons.length > 0) sectionGroups.push({ section, lessons: sectionLessons });
    }
    const unsectioned = course.lessons.filter((l) => !(l as Lesson & { sectionId?: string | null }).sectionId);
    if (unsectioned.length > 0) sectionGroups.push({ section: null, lessons: unsectioned });
  }

  const handleEnroll = async () => {
    setEnrolling(true);
    setEnrollError("");
    const res = await fetch("/api/enroll", {
      method: "POST",
      body: JSON.stringify({ courseId: course.id }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) { router.refresh(); }
    else {
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
    // Auto-advance to next lesson
    const idx = course.lessons.findIndex((l) => l.id === lessonId);
    if (idx + 1 < course.lessons.length) setActiveLesson(course.lessons[idx + 1]);
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
    if (res.ok) { setSubmitted((s) => ({ ...s, [assignmentId]: true })); }
    else {
      const data = await res.json().catch(() => ({}));
      setSubmitError((e) => ({ ...e, [assignmentId]: data.error ?? "Submission failed" }));
    }
    setSubmitting(null);
  };

  // ── Unenrolled preview ────────────────────────────────────────────────────────
  if (!enrolled) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="rnda-gradient h-32 flex items-end p-6">
            <span className="text-5xl">{SUBJECT_ICONS[course.subject] ?? "📚"}</span>
          </div>
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <Badge className={SUBJECT_COLORS[course.subject] ?? ""}>{SUBJECTS[course.subject as keyof typeof SUBJECTS]}</Badge>
              <Badge className="bg-gray-100 text-gray-600">Grade {course.grade}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <p className="text-sm text-gray-400 mb-6">By {course.teacher.name}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1.5"><BookOpen size={14} /> {course.lessons.length} lessons</span>
              {course.sections.length > 0 && (
                <span className="flex items-center gap-1.5"><Folder size={14} /> {course.sections.length} sections</span>
              )}
            </div>
            {enrollError && <p className="text-sm text-red-500 mb-3">{enrollError}</p>}
            <Button loading={enrolling} onClick={handleEnroll} size="lg" className="w-full bg-[#6db33f] hover:bg-[#5a9a34] text-white">
              Enroll Now — It&apos;s Free
            </Button>
          </div>
        </div>

        {/* Pathway preview */}
        <Card>
          <CardContent className="py-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-[#6db33f]" /> Learning Pathway
            </h2>
            <div className="space-y-0">
              {sectionGroups.map(({ section, lessons: sLessons }) => (
                <div key={section?.id ?? "unsectioned"}>
                  {section && (
                    <div className="flex items-center gap-2 py-2 mb-1">
                      <Folder size={13} className="text-[#6db33f]" />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{section.name}</span>
                    </div>
                  )}
                  {sLessons.map((l, i) => {
                    const globalIndex = course.lessons.findIndex((cl) => cl.id === l.id);
                    const isLast = globalIndex === course.lessons.length - 1;
                    return (
                      <div key={l.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center shrink-0">
                            <Lock size={11} className="text-gray-300" />
                          </div>
                          {!isLast && <div className="w-0.5 h-6 bg-gray-100 my-0.5" />}
                        </div>
                        <div className="pb-2 pt-1 flex-1 min-w-0">
                          <p className="text-sm text-gray-400">{l.title}</p>
                          {l.duration && <p className="text-[10px] text-gray-300 flex items-center gap-1 mt-0.5"><Clock size={9} />{l.duration} min</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Enrolled: pathway + content ───────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

      {/* ── Left: Pathway sidebar ──────────────────────────────────────────────── */}
      <div className="w-full lg:w-72 lg:shrink-0 space-y-3">

        {/* Progress card */}
        <Card>
          <CardContent className="py-4">
            <h2 className="font-semibold text-[#1e5631] text-sm mb-2 truncate">{course.title}</h2>
            <Progress value={progress} showLabel className="mb-1.5" />
            <p className="text-xs text-gray-400">{completedCount}/{course.lessons.length} lessons completed</p>
          </CardContent>
        </Card>

        {/* Continue banner */}
        {!courseComplete && nextLesson && !showAssignments && (
          <button
            onClick={() => { setActiveLesson(nextLesson); setShowAssignments(false); }}
            className="w-full text-left bg-[#1e5631] hover:bg-[#163d24] text-white rounded-xl px-4 py-3 transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Play size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-white/60 uppercase tracking-wide">Continue Learning</p>
              <p className="text-sm font-semibold text-white truncate">{nextLesson.title}</p>
            </div>
            <ArrowRight size={15} className="text-white/60 shrink-0" />
          </button>
        )}

        {courseComplete && (
          <div className="bg-[#f0f7eb] border border-[#6db33f]/30 rounded-xl px-4 py-3 text-center">
            <CheckCircle2 size={20} className="text-[#6db33f] mx-auto mb-1" />
            <p className="text-sm font-semibold text-[#1e5631]">Course Complete!</p>
            <p className="text-xs text-gray-500 mt-0.5">Check your certificates</p>
          </div>
        )}

        {/* Tab toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setShowAssignments(false)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${!showAssignments ? "bg-white text-[#1e5631] shadow-sm" : "text-gray-500"}`}
          >
            Pathway
          </button>
          <button
            onClick={() => setShowAssignments(true)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 ${showAssignments ? "bg-white text-[#1e5631] shadow-sm" : "text-gray-500"}`}
          >
            <ClipboardList size={11} /> Tasks
            {course.assignments.filter((a) => !a.submissions.length).length > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
                {course.assignments.filter((a) => !a.submissions.length).length}
              </span>
            )}
          </button>
        </div>

        {/* ── Pathway steps ──────────────────────────────────────────────────────── */}
        {!showAssignments && (
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            {sectionGroups.map(({ section, lessons: sLessons }) => (
              <div key={section?.id ?? "unsectioned"}>
                {section && (
                  <div className="flex items-center gap-1.5 py-2 mb-1 border-b border-gray-50">
                    <Folder size={12} className="text-[#6db33f] shrink-0" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{section.name}</span>
                  </div>
                )}
                {sLessons.map((lesson) => {
                  const globalIndex = course.lessons.findIndex((cl) => cl.id === lesson.id);
                  const state = getLessonState(lesson, globalIndex, localCompleted, firstIncompleteIndex);
                  const isActive = activeLesson?.id === lesson.id;
                  const isLast   = globalIndex === course.lessons.length - 1;

                  return (
                    <div key={lesson.id} className="flex gap-3">
                      {/* Step indicator + connector line */}
                      <div className="flex flex-col items-center shrink-0">
                        <button
                          onClick={() => { setActiveLesson(lesson); setShowAssignments(false); }}
                          className="relative mt-2"
                          title={lesson.title}
                        >
                          {state === "completed" ? (
                            <div className="w-6 h-6 rounded-full bg-[#6db33f] flex items-center justify-center shadow-sm">
                              <CheckCircle2 size={14} className="text-white" />
                            </div>
                          ) : state === "current" ? (
                            <div className="w-6 h-6 rounded-full border-2 border-[#6db33f] bg-white flex items-center justify-center shadow-sm ring-2 ring-[#6db33f]/20 animate-pulse">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#6db33f]" />
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? "border-[#6db33f] bg-[#f0f7eb]" : "border-gray-200 bg-white"}`}>
                              <div className={`w-2 h-2 rounded-full ${isActive ? "bg-[#6db33f]" : "bg-gray-200"}`} />
                            </div>
                          )}
                        </button>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 my-0.5 min-h-[16px] ${state === "completed" ? "bg-[#6db33f]/40" : "bg-gray-100"}`} />
                        )}
                      </div>

                      {/* Lesson info */}
                      <button
                        onClick={() => { setActiveLesson(lesson); setShowAssignments(false); }}
                        className={`flex-1 min-w-0 text-left py-2 pr-1 group ${isLast ? "" : "pb-2"}`}
                      >
                        <p className={`text-xs font-medium leading-tight truncate transition-colors ${
                          isActive         ? "text-[#1e5631]"
                          : state === "completed" ? "text-gray-500"
                          : state === "current"   ? "text-[#1e5631]"
                          : "text-gray-400 group-hover:text-gray-600"
                        }`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {lesson.duration && (
                            <p className="text-[10px] text-gray-300 flex items-center gap-0.5">
                              <Clock size={9} />{lesson.duration}m
                            </p>
                          )}
                          {state === "current" && (
                            <span className="text-[9px] font-semibold text-[#6db33f] uppercase tracking-wide">Up next</span>
                          )}
                          {isActive && state !== "current" && (
                            <ChevronRight size={10} className="text-[#6db33f]" />
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* ── Assignments list ───────────────────────────────────────────────────── */}
        {showAssignments && (
          <div className="space-y-2">
            {course.assignments.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No assignments yet.</p>
            )}
            {course.assignments.map((a) => {
              const sub = a.submissions[0];
              const isOverdue = new Date(a.dueDate) < new Date();
              return (
                <div key={a.id} className="w-full text-left bg-white border border-gray-100 rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-800 truncate">{a.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={9} /> {formatDate(a.dueDate)}
                    {isOverdue && !sub && <span className="text-red-500"> · Overdue</span>}
                  </p>
                  {sub ? (
                    <span className="text-[10px] text-[#6db33f]">
                      {sub.grade !== null ? `Graded: ${sub.grade}/${a.maxScore}` : "✓ Submitted"}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600">Pending submission</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Right: Content area ────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Assignments view */}
        {showAssignments ? (
          course.assignments.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-gray-400">No assignments for this course yet.</CardContent>
            </Card>
          ) : (
            course.assignments.map((a) => {
              const alreadySubmitted = !!a.submissions[0] || submitted[a.id];
              const form = submitForm[a.id] ?? { content: "", fileUrl: "" };
              const isOverdue = new Date(a.dueDate) < new Date();
              return (
                <Card key={a.id}>
                  <CardContent className="py-5">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-lg font-bold text-gray-900">{a.title}</h2>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} /> Due {formatDate(a.dueDate)}
                        </p>
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
                        <Button loading={submitting === a.id} onClick={() => handleSubmitAssignment(a.id)}>
                          Submit Assignment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )
        ) : activeLesson ? (
          /* Lesson viewer */
          <div className="space-y-4">
            {activeLesson.videoUrl && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
                <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen title={activeLesson.title} />
              </div>
            )}

            <Card>
              <CardContent className="py-5">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
                      Lesson {course.lessons.findIndex((l) => l.id === activeLesson.id) + 1} of {course.lessons.length}
                    </p>
                    <h2 className="text-xl font-bold text-gray-900">{activeLesson.title}</h2>
                  </div>
                  {localCompleted.has(activeLesson.id) ? (
                    <Badge variant="success" className="shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Completed
                    </Badge>
                  ) : (
                    <Button size="sm" loading={markingDone} onClick={() => handleMarkDone(activeLesson.id)}
                      className="bg-[#6db33f] hover:bg-[#5a9a34] text-white shrink-0 gap-1.5"
                    >
                      <CheckCircle2 size={14} /> Mark as Done
                    </Button>
                  )}
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {activeLesson.content}
                </div>

                {activeLesson.resourceUrl && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <a
                      href={activeLesson.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#1e5631] bg-[#f0f7eb] hover:bg-[#d8efc5] px-4 py-2.5 rounded-xl transition-colors font-medium"
                    >
                      <FileText size={16} /> Download Resource / PDF
                    </a>
                  </div>
                )}

                {/* Next lesson nudge */}
                {localCompleted.has(activeLesson.id) && nextLesson && nextLesson.id !== activeLesson.id && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setActiveLesson(nextLesson)}
                      className="w-full flex items-center gap-3 bg-[#f0f7eb] hover:bg-[#d8efc5] rounded-xl px-4 py-3 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Up next</p>
                        <p className="text-sm font-semibold text-[#1e5631] truncate">{nextLesson.title}</p>
                      </div>
                      <ArrowRight size={16} className="text-[#6db33f] shrink-0" />
                    </button>
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
