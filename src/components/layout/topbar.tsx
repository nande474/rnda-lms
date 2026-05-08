"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    grade: number | null;
  };
}

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  ADMIN:   { label: "Admin",   color: "bg-purple-100 text-purple-700" },
  TEACHER: { label: "Teacher", color: "bg-blue-100 text-blue-700" },
  STUDENT: { label: "Student", color: "bg-[#e8f5d9] text-[#1e5631]" },
};

export function Topbar({ user }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const badge = ROLE_BADGE[user.role] ?? ROLE_BADGE.STUDENT;
  const initials = (user.name ?? user.email ?? "?")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 z-30 flex items-center px-6 gap-4"
      style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e8f0e8" }}>

      {/* Welcome */}
      <div className="flex-1 flex items-center gap-3">
        <div>
          <p className="text-xs text-gray-400 leading-none mb-0.5">Welcome back</p>
          <p className="text-sm font-semibold text-[#1e5631] leading-none">
            {user.name ?? user.email}
          </p>
        </div>
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", badge.color)}>
          {badge.label}{user.grade ? ` · Grade ${user.grade}` : ""}
        </span>
      </div>

      {/* Bell */}
      <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-[#f0f7eb] hover:text-[#1e5631] transition-colors">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6db33f] rounded-full border-2 border-white" />
      </button>

      {/* Divider */}
      <div className="w-px h-7 bg-gray-100" />

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[#f0f7eb] transition-colors"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#1e5631] flex items-center justify-center shadow-sm">
            {user.image ? (
              <Image src={user.image} alt={user.name ?? ""} width={32} height={32} className="object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">{initials}</span>
            )}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-tight">{user.name ?? "User"}</p>
            <p className="text-[10px] text-gray-400 leading-tight truncate max-w-[120px]">{user.email}</p>
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
              <div className="px-4 py-3 bg-[#f0f7eb] border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1e5631] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1e5631] leading-tight truncate max-w-[120px]">
                    {user.name ?? "User"}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{user.email}</p>
                </div>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <User size={14} className="text-gray-400" />
                  My Profile
                </button>
                <div className="h-px bg-gray-100 mx-3 my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
