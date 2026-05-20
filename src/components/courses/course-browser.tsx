"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SUBJECTS, SUBJECT_COLORS, SUBJECT_ICONS, GRADES } from "@/lib/utils";
import { Users, BookOpen, Search } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  lessons: Array<{ id: string }>;
  enrollments: Array<{ userId: string }>;
  teacher: { name: string | null };
}

interface CourseBrowserProps {
  courses: Course[];
  enrolledIds: Set<string>;
  userGrade: number | null;
  isPrivileged?: boolean;
}

export function CourseBrowser({ courses, enrolledIds, userGrade, isPrivileged }: CourseBrowserProps) {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState(userGrade ? String(userGrade) : "");
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    if (subject && c.subject !== subject) return false;
    if (grade && c.grade !== Number(grade)) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">Browse Courses</h1>
        <p className="text-gray-500 text-sm mt-1">
          {!isPrivileged && userGrade
            ? `Showing Grade ${userGrade} STEM courses`
            : "STEM afterschool courses for Grades 5–12"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none text-gray-700"
          />
        </div>
        <Select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          options={Object.entries(SUBJECTS).map(([v, l]) => ({ value: v, label: l }))}
          placeholder="All Subjects"
          className="w-44"
        />
        {isPrivileged && (
          <Select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            options={GRADES.map((g) => ({ value: g, label: `Grade ${g}` }))}
            placeholder="All Grades"
            className="w-36"
          />
        )}
        {(subject || grade || search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSubject(""); setGrade(""); setSearch(""); }}
          >
            Clear
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
          <p>No courses match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardContent className="flex-1 py-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{SUBJECT_ICONS[c.subject] ?? "📚"}</span>
                  <Badge className={SUBJECT_COLORS[c.subject] ?? ""}>
                    {SUBJECTS[c.subject as keyof typeof SUBJECTS]}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{c.title}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} /> {c.lessons.length} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {c.enrollments.length} enrolled
                  </span>
                  <Badge className="bg-gray-100 text-gray-600">Grade {c.grade}</Badge>
                </div>
                <p className="text-xs text-gray-400">By {c.teacher.name}</p>
              </CardContent>
              <div className="px-6 pb-4">
                <Link href={`/courses/${c.id}`} className="block">
                  <Button
                    variant={enrolledIds.has(c.id) ? "secondary" : "primary"}
                    className="w-full"
                    size="sm"
                  >
                    {enrolledIds.has(c.id) ? "Continue Learning" : "View Course"}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
