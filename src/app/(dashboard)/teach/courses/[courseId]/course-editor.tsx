"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { Plus, BookOpen, Users, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  duration: number | null;
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
    enrollments: Array<{ user: { name: string | null; email: string; image: string | null } }>;
  };
}

export function CourseEditor({ course: initial }: CourseEditorProps) {
  const router = useRouter();
  const [course, setCourse] = useState(initial);
  const [lessons, setLessons] = useState(initial.lessons);
  const [showNewLesson, setShowNewLesson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"lessons" | "students">("lessons");

  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    videoUrl: "",
    duration: "",
  });

  const togglePublish = async () => {
    setSaving(true);
    const res = await fetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !course.published }),
    });
    if (res.ok) {
      setCourse((c) => ({ ...c, published: !c.published }));
    }
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
      setNewLesson({ title: "", content: "", videoUrl: "", duration: "" });
      setShowNewLesson(false);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
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
        <Button
          variant={course.published ? "outline" : "primary"}
          loading={saving}
          onClick={togglePublish}
        >
          {course.published ? (
            <><EyeOff size={16} /> Unpublish</>
          ) : (
            <><Eye size={16} /> Publish</>
          )}
        </Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {(["lessons", "students"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${
              tab === t
                ? "border-[#6db33f] text-[#6db33f]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t === "lessons" ? (
              <span className="flex items-center gap-1.5"><BookOpen size={14} /> Lessons ({lessons.length})</span>
            ) : (
              <span className="flex items-center gap-1.5"><Users size={14} /> Students ({course.enrollments.length})</span>
            )}
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
                  <p className="text-xs text-gray-400 truncate">{lesson.content.slice(0, 80)}…</p>
                </div>
                {lesson.duration && (
                  <span className="text-xs text-gray-400">{lesson.duration} min</span>
                )}
                <button
                  onClick={() => deleteLesson(lesson.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
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
                  <Input
                    label="Title"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    required
                  />
                  <Textarea
                    label="Content"
                    value={newLesson.content}
                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                    required
                    className="min-h-[150px]"
                  />
                  <Input
                    label="Video URL (optional)"
                    placeholder="YouTube embed or direct URL"
                    value={newLesson.videoUrl}
                    onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                  />
                  <Input
                    label="Duration (minutes, optional)"
                    type="number"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Add Lesson</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowNewLesson(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <button
              onClick={() => setShowNewLesson(true)}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#6db33f] hover:text-[#6db33f] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Lesson
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
