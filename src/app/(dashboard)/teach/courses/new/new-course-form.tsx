"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SUBJECTS, GRADES } from "@/lib/utils";

interface NewCourseFormProps {
  teacherId: string;
}

export function NewCourseForm({ teacherId }: NewCourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    grade: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, grade: Number(form.grade) }),
    });

    if (res.ok) {
      const { course } = await res.json();
      router.push(`/teach/courses/${course.id}`);
    } else {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Course Title"
            placeholder="e.g. Introduction to Algebra"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="What will students learn?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <Select
            label="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            options={Object.entries(SUBJECTS).map(([v, l]) => ({ value: v, label: l }))}
            placeholder="Select subject"
            required
          />
          <Select
            label="Grade"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            options={GRADES.map((g) => ({ value: g, label: `Grade ${g}` }))}
            placeholder="Select grade"
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} disabled={!form.title || !form.subject || !form.grade}>
              Create Course
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
