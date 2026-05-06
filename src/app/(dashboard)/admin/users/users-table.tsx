"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  grade: number | null;
  createdAt: Date;
  enrollments: Array<{ id: string }>;
  taughtCourses: Array<{ id: string }>;
}

const ROLE_COLORS: Record<string, "default" | "info" | "success" | "warning"> = {
  ADMIN: "warning",
  TEACHER: "info",
  STUDENT: "success",
};

export function UsersTable({ users: initial }: { users: User[] }) {
  const [users, setUsers] = useState(initial);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateRole = async (userId: string, role: string) => {
    setUpdating(userId);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    }
    setUpdating(null);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Grade</th>
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
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={ROLE_COLORS[user.role]}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {user.grade ? `Grade ${user.grade}` : "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{user.enrollments.length}</td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-3">
                    <Select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      options={[
                        { value: "STUDENT", label: "Student" },
                        { value: "TEACHER", label: "Teacher" },
                        { value: "ADMIN", label: "Admin" },
                      ]}
                      className="w-28 text-xs py-1"
                      disabled={updating === user.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
