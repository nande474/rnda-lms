"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, AlertCircle, Layers, ClipboardList, Clock } from "lucide-react";
import Link from "next/link";

const PACKS = [
  {
    id: "grade8-term1",
    title: "Grade 8 Mathematics — Term 1",
    subject: "Mathematics",
    grade: 8,
    term: "Term 1",
    description: "CAPS-aligned self-directed course. Students can complete this entirely on their own — every lesson includes explanations, worked examples, practice questions, and answers.",
    sections: [
      { name: "Whole Numbers & Number Theory",    lessons: 4, hasAssignment: true },
      { name: "Integers",                          lessons: 4, hasAssignment: true },
      { name: "Exponents",                         lessons: 3, hasAssignment: true },
      { name: "Numeric and Geometric Patterns",    lessons: 3, hasAssignment: true },
    ],
    totalLessons:     14,
    totalAssignments: 4,
    estimatedHours:   "8–10 hours",
  },
];

export default function CurriculumPage() {
  const [loading, setLoading]   = useState<string | null>(null);
  const [results, setResults]   = useState<Record<string, { ok: boolean; message: string; courseId?: string }>>({});

  const loadPack = async (packId: string) => {
    setLoading(packId);
    try {
      const res = await fetch("/api/admin/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packId }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults((r) => ({
          ...r,
          [packId]: {
            ok: true,
            message: `Loaded! ${data.sectionCount} sections, ${data.lessonCount} lessons, ${data.assignmentCount} assignments.`,
            courseId: data.courseId,
          },
        }));
      } else {
        setResults((r) => ({
          ...r,
          [packId]: { ok: false, message: data.error ?? "Failed to load curriculum." },
        }));
      }
    } catch {
      setResults((r) => ({ ...r, [packId]: { ok: false, message: "Network error." } }));
    }
    setLoading(null);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">Curriculum Packs</h1>
        <p className="text-gray-500 text-sm mt-1">
          Load pre-built CAPS-aligned courses into the platform with one click.
          Each pack includes lessons with full explanations, worked examples, and assessment tasks.
        </p>
      </div>

      <div className="space-y-5">
        {PACKS.map((pack) => {
          const result  = results[pack.id];
          const busy    = loading === pack.id;

          return (
            <Card key={pack.id} className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#1e5631] to-[#6db33f]" />
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">📐</div>
                    <div>
                      <h2 className="font-bold text-gray-900">{pack.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-blue-100 text-blue-800 text-[10px]">{pack.subject}</Badge>
                        <Badge className="bg-gray-100 text-gray-600 text-[10px]">Grade {pack.grade}</Badge>
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{pack.term}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Clock size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{pack.estimatedHours}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{pack.description}</p>

                {/* Section breakdown */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What&apos;s included</p>
                  {pack.sections.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <Layers size={13} className="text-[#6db33f]" />
                        <span className="text-sm text-gray-700">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><BookOpen size={11} />{s.lessons} lessons</span>
                        {s.hasAssignment && <span className="flex items-center gap-1"><ClipboardList size={11} />1 task</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><BookOpen size={12} />{pack.totalLessons} lessons</span>
                  <span className="flex items-center gap-1"><ClipboardList size={12} />{pack.totalAssignments} assessment tasks</span>
                </div>

                {/* Result message */}
                {result && (
                  <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${result.ok ? "bg-[#f0f7eb] text-[#1e5631]" : "bg-red-50 text-red-700"}`}>
                    {result.ok
                      ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      : <AlertCircle  size={16} className="shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-medium">{result.message}</p>
                      {result.ok && result.courseId && (
                        <Link
                          href={`/teach/courses/${result.courseId}`}
                          className="text-[#6db33f] hover:underline text-xs mt-1 block"
                        >
                          Open course editor →
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Load button */}
                {!result?.ok && (
                  <Button
                    onClick={() => loadPack(pack.id)}
                    loading={busy}
                    className="bg-[#6db33f] hover:bg-[#5a9a34] text-white"
                  >
                    Load Curriculum Pack
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
