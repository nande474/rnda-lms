"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { formatDate, getSiteName, SITES } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  grade: number | null;
  siteId: number | null;
  createdAt: Date;
  enrollments: Array<{ id: string }>;
  taughtCourses: Array<{ id: string }>;
}

const ROLE_COLORS: Record<string, "default" | "info" | "success" | "warning"> = {
  SUPERADMIN: "warning",
  ADMIN:      "warning",
  SITEADMIN:  "default",
  TEACHER:    "info",
  STUDENT:    "success",
};

const ROLE_LEVEL: Record<string, number> = {
  STUDENT: 1, TEACHER: 2, SITEADMIN: 3, ADMIN: 4, SUPERADMIN: 5,
};

export function UsersTable({ users: initial, currentUserRole }: { users: User[]; currentUserRole: string }) {
  const [users, setUsers] = useState(initial);
  const [updating, setUpdating] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const currentLevel = ROLE_LEVEL[currentUserRole] ?? 0;

  const updateUser = async (userId: string, patch: { role?: string; grade?: number | null; siteId?: number | null }) => {
    setUpdating(userId);
    setRowError((e) => ({ ...e, [userId]: "" }));

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)));
    } else {
      const data = await res.json().catch(() => ({}));
      setRowError((e) => ({ ...e, [userId]: data.error ?? "Failed to save" }));
    }
    setUpdating(null);
  };

  const ActionControls = ({ user }: { user: User }) =>
    (ROLE_LEVEL[user.role] ?? 0) >= currentLevel ? (
      <span className="text-xs text-gray-400 italic">Protected</span>
    ) : (
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={user.role}
          onChange={(e) => updateUser(user.id, { role: e.target.value })}
          options={[
            { value: "STUDENT",   label: "Student" },
            { value: "TEACHER",   label: "Teacher" },
            { value: "SITEADMIN", label: "Site Admin" },
            ...(currentLevel >= ROLE_LEVEL.SUPERADMIN
              ? [{ value: "ADMIN", label: "Admin" }, { value: "SUPERADMIN", label: "Super Admin" }]
              : currentLevel >= ROLE_LEVEL.ADMIN
              ? [{ value: "ADMIN", label: "Admin" }]
              : []),
          ]}
          className="w-28 text-xs py-1"
          disabled={updating === user.id}
        />
        <Select
          value={user.grade?.toString() ?? ""}
          onChange={(e) => updateUser(user.id, { grade: e.target.value ? Number(e.target.value) : null })}
          options={[
            { value: "", label: "No grade" },
            ...[5, 6, 7, 8, 9, 10, 11, 12].map((g) => ({ value: String(g), label: `Grade ${g}` })),
          ]}
          className="w-24 text-xs py-1"
          disabled={updating === user.id}
        />
        <Select
          value={user.siteId?.toString() ?? ""}
          onChange={(e) => updateUser(user.id, { siteId: e.target.value ? Number(e.target.value) : null })}
          options={[
            { value: "", label: "No site" },
            ...Object.entries(SITES).map(([id, s]) => ({ value: id, label: s.shortName })),
          ]}
          className="w-24 text-xs py-1"
          disabled={updating === user.id}
        />
      </div>
    );

  return (
    <div>
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#6db33f] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <Badge variant={ROLE_COLORS[user.role] ?? "default"} className="shrink-0 text-[10px]">{user.role}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                {user.grade && <span>Grade {user.grade}</span>}
                {user.siteId && <span>{getSiteName(user.siteId)}</span>}
                <span>{user.enrollments.length} enrolled</span>
              </div>
              {rowError[user.id] && <p className="text-xs text-red-500 mb-2">{rowError[user.id]}</p>}
              <ActionControls user={user} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table view */}
      <Card className="hidden md:block">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Site</th>
                <th className="px-6 py-3 text-left">Enrolled</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#6db33f] flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        {rowError[user.id] && (
                          <p className="text-xs text-red-500 mt-0.5">{rowError[user.id]}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={ROLE_COLORS[user.role] ?? "default"}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {user.grade ? `Grade ${user.grade}` : "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {user.siteId ? getSiteName(user.siteId) : "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{user.enrollments.length}</td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-3">
                    <ActionControls user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}
