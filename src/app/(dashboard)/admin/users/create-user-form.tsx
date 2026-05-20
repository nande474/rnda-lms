"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Eye, EyeOff, UserPlus, X } from "lucide-react";
import { SITES } from "@/lib/utils";

function PasswordInput({
  placeholder,
  value,
  onChange,
  disabled,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        tabIndex={-1}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

const EMPTY = { name: "", email: "", role: "STUDENT", grade: "", site: "", password: "", confirm: "" };

const ROLE_LEVEL: Record<string, number> = {
  STUDENT: 1, TEACHER: 2, SITEADMIN: 3, ADMIN: 4, SUPERADMIN: 5,
};

export function CreateUserForm({ currentUserRole }: { currentUserRole: string }) {
  const currentLevel = ROLE_LEVEL[currentUserRole] ?? 0;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(EMPTY);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        role: form.role,
        grade: form.grade ? Number(form.grade) : null,
        siteId: form.site ? Number(form.site) : null,
        password: form.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to create user");
    } else {
      setSuccess(`${form.name} was created successfully.`);
      setForm(EMPTY);
      router.refresh();
      setTimeout(() => {
        setSuccess("");
        setOpen(false);
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div>
      <Button
        onClick={() => { setOpen((v) => !v); setError(""); setSuccess(""); }}
        className="bg-[#6db33f] hover:bg-[#5a9a34] text-white gap-2"
      >
        <UserPlus size={16} />
        Create User
      </Button>

      {open && (
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-[#f0f7eb] border-b border-gray-100">
            <h2 className="font-semibold text-[#1e5631] text-sm">New User</h2>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Full name</label>
              <Input placeholder="e.g. Thabo Nkosi" value={form.name} onChange={set("name")} required disabled={loading} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Email address</label>
              <Input type="email" placeholder="e.g. thabo@school.co.za" value={form.email} onChange={set("email")} required disabled={loading} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Role</label>
              <Select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                options={[
                  { value: "STUDENT",   label: "Student" },
                  { value: "TEACHER",   label: "Teacher" },
                  { value: "SITEADMIN", label: "Site Admin" },
                  ...(currentLevel >= ROLE_LEVEL.ADMIN      ? [{ value: "ADMIN",      label: "Admin" }]       : []),
                  ...(currentLevel >= ROLE_LEVEL.SUPERADMIN ? [{ value: "SUPERADMIN", label: "Super Admin" }] : []),
                ]}
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Site</label>
              <Select
                value={form.site}
                onChange={(e) => setForm((f) => ({ ...f, site: e.target.value }))}
                options={[
                  { value: "", label: "No site (global)" },
                  ...Object.entries(SITES).map(([id, s]) => ({ value: id, label: s.shortName })),
                ]}
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Grade (teachers &amp; students)</label>
              <Select
                value={form.grade}
                onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                options={[
                  { value: "", label: "No grade" },
                  ...[5, 6, 7, 8, 9, 10, 11, 12].map((g) => ({ value: String(g), label: `Grade ${g}` })),
                ]}
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Password</label>
              <PasswordInput placeholder="Min. 8 characters" value={form.password} onChange={set("password")} disabled={loading} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Confirm password</label>
              <PasswordInput placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} disabled={loading} />
            </div>

            {error && (
              <p className="sm:col-span-2 text-sm text-red-500">{error}</p>
            )}
            {success && (
              <p className="sm:col-span-2 text-sm text-[#1e5631] font-medium">{success}</p>
            )}

            <div className="sm:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6db33f] hover:bg-[#5a9a34] text-white" disabled={loading}>
                {loading ? "Creating…" : "Create User"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
