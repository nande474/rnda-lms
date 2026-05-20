"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, UserPlus, X } from "lucide-react";

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

const EMPTY = { name: "", email: "", password: "", confirm: "" };

export function AddStudentForm({ grade }: { grade: number }) {
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

    const res = await fetch("/api/teach/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to add student");
    } else {
      setSuccess(`${form.name} was added to Grade ${grade}.`);
      setForm(EMPTY);
      router.refresh();
      setTimeout(() => { setSuccess(""); setOpen(false); }, 2000);
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
        Add Student
      </Button>

      {open && (
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-[#f0f7eb] border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-[#1e5631] text-sm">New Student</h2>
              <p className="text-xs text-gray-400 mt-0.5">Will be added to Grade {grade}</p>
            </div>
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
              <label className="text-xs font-medium text-gray-500">Password</label>
              <PasswordInput placeholder="Min. 8 characters" value={form.password} onChange={set("password")} disabled={loading} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Confirm password</label>
              <PasswordInput placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} disabled={loading} />
            </div>

            {error && <p className="sm:col-span-2 text-sm text-red-500">{error}</p>}
            {success && <p className="sm:col-span-2 text-sm text-[#1e5631] font-medium">{success}</p>}

            <div className="sm:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6db33f] hover:bg-[#5a9a34] text-white" disabled={loading}>
                {loading ? "Adding…" : "Add Student"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
