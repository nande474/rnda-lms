"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { Plus, Users, Calendar, CheckCircle2, XCircle, Save, Lock, LockOpen } from "lucide-react";

interface Student { id: string; name: string | null; email: string }
interface Course  { id: string; title: string; grade: number }
interface AttendanceRecord { userId: string; present: boolean; notes?: string | null; user: { name: string | null; email: string } }
interface AttendanceSession {
  id: string;
  title: string;
  date: Date;
  courseId: string | null;
  closed: boolean;
  course: { title: string } | null;
  records: AttendanceRecord[];
}

interface Props {
  attendanceSessions:  AttendanceSession[];
  courses:             Course[];
  courseStudentsMap:   Record<string, Student[]>;
  fallbackStudents:    Student[];
  teacherId:           string;
}

export function AttendanceManager({
  attendanceSessions: initial,
  courses,
  courseStudentsMap,
  fallbackStudents,
  teacherId,
}: Props) {
  const [sessions,      setSessions]    = useState(initial);
  const [showNew,       setShowNew]     = useState(false);
  const [activeSession, setActive]      = useState<AttendanceSession | null>(null);
  const [saving,        setSaving]      = useState(false);
  const [locking,       setLocking]     = useState(false);
  const [creating,      setCreating]    = useState(false);
  const [saved,         setSaved]       = useState(false);
  const [form, setForm]                 = useState({ title: "", date: "", courseId: "" });
  const [register, setRegister]         = useState<Record<string, { present: boolean; notes: string }>>({});

  const getStudentsForCourse = (courseId: string) =>
    courseId ? (courseStudentsMap[courseId] ?? fallbackStudents) : fallbackStudents;

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const studentList = getStudentsForCourse(form.courseId);
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, studentIds: studentList.map((s) => s.id) }),
    });
    if (res.ok) {
      const { session } = await res.json();
      const courseObj = courses.find((c) => c.id === form.courseId);
      const newSession: AttendanceSession = {
        ...session,
        course:  courseObj ? { title: courseObj.title } : null,
        records: studentList.map((s) => ({ userId: s.id, present: false, notes: null, user: { name: s.name, email: s.email } })),
      };
      setSessions((prev) => [newSession, ...prev]);
      setForm({ title: "", date: "", courseId: "" });
      setShowNew(false);
      openSession(newSession);
    }
    setCreating(false);
  };

  const openSession = (sess: AttendanceSession) => {
    setActive(sess);
    setSaved(false);
    const init: Record<string, { present: boolean; notes: string }> = {};
    sess.records.forEach((r) => { init[r.userId] = { present: r.present, notes: r.notes ?? "" }; });
    setRegister(init);
  };

  const togglePresent = (userId: string) =>
    setRegister((reg) => ({ ...reg, [userId]: { ...reg[userId], present: !reg[userId]?.present } }));

  const toggleLock = async () => {
    if (!activeSession) return;
    setLocking(true);
    const nextClosed = !activeSession.closed;
    const res = await fetch(`/api/attendance/${activeSession.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ closed: nextClosed }),
    });
    if (res.ok) {
      const updated = { ...activeSession, closed: nextClosed };
      setActive(updated);
      setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? { ...s, closed: nextClosed } : s)));
    }
    setLocking(false);
  };

  const saveRegister = async () => {
    if (!activeSession) return;
    setSaving(true);
    const records = Object.entries(register).map(([userId, v]) => ({ userId, present: v.present, notes: v.notes }));
    const res = await fetch(`/api/attendance/${activeSession.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records }),
    });
    if (res.ok) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? { ...s, records: records.map((r) => ({ ...r, user: activeSession.records.find((ar) => ar.userId === r.userId)?.user ?? { name: null, email: "" } })) }
            : s
        )
      );
      setSaved(true);
    }
    setSaving(false);
  };

  const present = Object.values(register).filter((r) => r.present).length;
  const total   = Object.keys(register).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e5631]">Attendance Register</h1>
          <p className="text-gray-500 text-sm mt-1">Record Saturday sessions and capture student attendance</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="bg-[#6db33f] hover:bg-[#5a9a34] text-white gap-2">
          <Plus size={16} /> New Session
        </Button>
      </div>

      {showNew && (
        <Card>
          <CardHeader><h3 className="font-semibold text-gray-800 text-sm">Create Attendance Session</h3></CardHeader>
          <CardContent>
            <form onSubmit={createSession} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Session title"
                  placeholder='e.g. "Saturday Session – 10 May 2026"'
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Date & time"
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              <Select
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                options={[
                  { value: "", label: "No specific course" },
                  ...courses.map((c) => ({
                    value: c.id,
                    label: `${c.title} (Grade ${c.grade}) · ${(courseStudentsMap[c.id] ?? []).length} students`,
                  })),
                ]}
                placeholder="Link to course (optional)"
              />
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit" loading={creating}>Create Session</Button>
                <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session list */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar size={14} /> Sessions
          </h2>
          {sessions.length === 0 && <p className="text-sm text-gray-400">No sessions yet. Create one above.</p>}
          {sessions.map((s) => {
            const presentCount = s.records.filter((r) => r.present).length;
            const isActive = activeSession?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => openSession(s)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  isActive ? "border-[#6db33f] bg-[#f0f7eb]" : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(s.date)}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Users size={11} /> {presentCount}/{s.records.length} present
                  {s.course && <span className="ml-2 text-[#6db33f]">· {s.course.title}</span>}
                </p>
              </button>
            );
          })}
        </div>

        {/* Register */}
        <div className="lg:col-span-2">
          {activeSession ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{activeSession.title}</h3>
                      {activeSession.closed && (
                        <Badge className="bg-gray-100 text-gray-500 text-[10px] flex items-center gap-1">
                          <Lock size={9} /> Locked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(activeSession.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1e5631]">{present}/{total}</p>
                      <p className="text-xs text-gray-400">present</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      loading={locking}
                      onClick={toggleLock}
                      className={activeSession.closed ? "border-amber-300 text-amber-700 hover:bg-amber-50" : "border-gray-200 text-gray-500"}
                      title={activeSession.closed ? "Unlock session" : "Lock session"}
                    >
                      {activeSession.closed ? <><LockOpen size={13} /> Unlock</> : <><Lock size={13} /> Lock</>}
                    </Button>
                  </div>
                </div>
                {/* Attendance bar */}
                {total > 0 && (
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6db33f] rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((present / total) * 100)}%` }}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="py-2">
                {activeSession.records.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-400">No students in this session.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {activeSession.records.map((r) => {
                      const state = register[r.userId] ?? { present: false, notes: "" };
                      return (
                        <div key={r.userId} className="flex items-center gap-3 py-3">
                          {/* Toggle switch */}
                          <button
                            type="button"
                            onClick={() => !activeSession.closed && togglePresent(r.userId)}
                            disabled={activeSession.closed}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ${
                              activeSession.closed ? "opacity-50 cursor-not-allowed" : ""
                            } ${state.present ? "bg-[#6db33f]" : "bg-gray-200"}`}
                            aria-label={state.present ? "Mark absent" : "Mark present"}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                state.present ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 leading-tight">{r.user.name ?? "Unknown"}</p>
                            <p className="text-xs text-gray-400">{r.user.email}</p>
                          </div>

                          <Badge variant={state.present ? "success" : "default"} className="text-xs shrink-0">
                            {state.present ? "Present" : "Absent"}
                          </Badge>

                          <Input
                            placeholder="Notes"
                            value={state.notes}
                            onChange={(e) =>
                              setRegister((reg) => ({ ...reg, [r.userId]: { ...reg[r.userId], notes: e.target.value } }))
                            }
                            className="w-32 text-xs py-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 mt-2 border-t border-gray-100 flex items-center gap-3">
                  <Button
                    onClick={saveRegister}
                    loading={saving}
                    disabled={activeSession.closed}
                    className="bg-[#6db33f] hover:bg-[#5a9a34] text-white gap-2 disabled:opacity-50"
                  >
                    <Save size={14} /> Save Attendance
                  </Button>
                  {saved && (
                    <div className="flex items-center gap-1.5 text-sm text-[#1e5631]">
                      <CheckCircle2 size={15} />
                      Saved
                    </div>
                  )}
                  {!saved && total > 0 && (
                    <p className="text-xs text-gray-400">
                      {total - present} absent · {present} present
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
              <XCircle size={32} className="text-gray-200 mb-3" />
              <p className="text-sm">Select a session to take attendance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
