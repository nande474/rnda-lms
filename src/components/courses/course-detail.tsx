"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SUBJECTS, SUBJECT_ICONS, SUBJECT_COLORS, calculateProgress } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, BookOpen, Play, Lock } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  duration: number | null;
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
  };
  enrolled: boolean;
  userId: string;
  completedIds: Set<string>;
}

export function CourseDetail({ course, enrolled, userId, completedIds }: CourseDetailProps) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    enrolled ? course.lessons[0] ?? null : null
  );
  const [markingDone, setMarkingDone] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(new Set(completedIds));

  const progress = calculateProgress(
    course.lessons.filter((l) => localCompleted.has(l.id)).length,
    course.lessons.length
  );

  const handleEnroll = async () => {
    setEnrolling(true);
    await fetch("/api/enroll", {
      method: "POST",
      body: JSON.stringify({ courseId: course.id }),
      headers: { "Content-Type": "application/json" },
    });
    router.refresh();
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
    if (nextIndex < course.lessons.length) {
      setActiveLesson(course.lessons[nextIndex]);
    }
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
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                  {i + 1}
                </div>
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
    <div className="flex gap-6 h-full">
      <div className="w-72 shrink-0 space-y-4">
        <Card>
          <CardContent className="py-4">
            <h2 className="font-semibold text-[#1e5631] text-sm mb-3">{course.title}</h2>
            <Progress value={progress} showLabel className="mb-2" />
            <p className="text-xs text-gray-400">
              {course.lessons.filter((l) => localCompleted.has(l.id)).length}/{course.lessons.length} lessons done
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3"><h3 className="text-sm font-semibold text-gray-700">Lessons</h3></CardHeader>
          <div className="divide-y divide-gray-50">
            {course.lessons.map((l, i) => {
              const done = localCompleted.has(l.id);
              const active = activeLesson?.id === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(l)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    active ? "bg-[#f0f7eb]" : "hover:bg-gray-50"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 size={16} className="text-[#6db33f] shrink-0" />
                  ) : (
                    <Circle size={16} className={`shrink-0 ${active ? "text-[#6db33f]" : "text-gray-300"}`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${active ? "text-[#1e5631]" : "text-gray-600"}`}>
                      {i + 1}. {l.title}
                    </p>
                    {l.duration && (
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {l.duration} min
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex-1 min-w-0">
        {activeLesson ? (
          <div className="space-y-4">
            {activeLesson.videoUrl && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  src={activeLesson.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={activeLesson.title}
                />
              </div>
            )}

            <Card>
              <CardContent className="py-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{activeLesson.title}</h2>
                  {localCompleted.has(activeLesson.id) ? (
                    <Badge variant="success"><CheckCircle2 size={12} className="mr-1" /> Completed</Badge>
                  ) : (
                    <Button
                      size="sm"
                      loading={markingDone}
                      onClick={() => handleMarkDone(activeLesson.id)}
                    >
                      <Play size={14} /> Mark as Done
                    </Button>
                  )}
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {activeLesson.content}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-gray-400">
              Select a lesson to start learning
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
