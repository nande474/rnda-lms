"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, ShieldCheck, Shield, GraduationCap, BookOpen } from "lucide-react";

const TEST_ACCOUNTS = [
  {
    role:     "Super Admin",
    email:    "admin@rnda",
    password: "Rnda@2024!",
    icon:     <ShieldCheck size={28} />,
    color:    "text-amber-600",
    bg:       "bg-amber-50 border-amber-200",
    badge:    "bg-amber-100 text-amber-700",
    desc:     "Full platform access · Audit logs · Analytics",
  },
  {
    role:     "Admin",
    email:    "admin2@rnda",
    password: "Rnda@2024!",
    icon:     <Shield size={28} />,
    color:    "text-orange-600",
    bg:       "bg-orange-50 border-orange-200",
    badge:    "bg-orange-100 text-orange-700",
    desc:     "User management · Courses · Announcements",
  },
  {
    role:     "Teacher",
    email:    "teacher1@rnda",
    password: "Rnda@2024!",
    icon:     <BookOpen size={28} />,
    color:    "text-blue-600",
    bg:       "bg-blue-50 border-blue-200",
    badge:    "bg-blue-100 text-blue-700",
    desc:     "Courses · Gradebook · Attendance",
  },
  {
    role:     "Student",
    email:    "student1@rnda",
    password: "Rnda@2024!",
    icon:     <GraduationCap size={28} />,
    color:    "text-[#1e5631]",
    bg:       "bg-[#f0f7eb] border-[#6db33f]",
    badge:    "bg-[#e0f0d0] text-[#1e5631]",
    desc:     "Browse courses · Assignments · Grades",
  },
];

export function QuickLoginCards() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const login = async (email: string, password: string, role: string) => {
    setLoading(role);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!result || result.error) {
      setError(`Sign-in failed for ${email}. Make sure the seed has been run.`);
      setLoading(null);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEST_ACCOUNTS.map((acc) => (
          <Card key={acc.role} className={`border-2 ${acc.bg} transition-all hover:shadow-md`}>
            <CardContent className="py-5">
              <div className={`mb-3 ${acc.color}`}>{acc.icon}</div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800">{acc.role}</h3>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${acc.badge}`}>
                  {acc.role.toUpperCase().replace(" ", "_")}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1 font-mono">{acc.email}</p>
              <p className="text-xs text-gray-400 mb-4">{acc.desc}</p>
              <button
                onClick={() => login(acc.email, acc.password, acc.role)}
                disabled={!!loading}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all
                  ${loading === acc.role
                    ? "opacity-60 cursor-not-allowed bg-gray-100 text-gray-400"
                    : `${acc.color} border-2 ${acc.bg.split(" ")[1]} hover:opacity-80 bg-white`
                  }`}
              >
                <LogIn size={14} />
                {loading === acc.role ? "Signing in…" : `Sign in as ${acc.role}`}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center">
        Password for all test accounts: <code className="bg-gray-100 px-1.5 py-0.5 rounded">Rnda@2024!</code>
      </p>
    </div>
  );
}
