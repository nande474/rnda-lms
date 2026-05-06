"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, ChevronDown } from "lucide-react";
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

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

export function Topbar({ user }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-30">
      <div className="flex-1">
        <h1 className="text-sm text-gray-500">
          Welcome back,{" "}
          <span className="text-[#1e5631] font-semibold">{user.name?.split(" ")[0]}</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 relative">
          <Bell size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#6db33f] flex items-center justify-center">
              {user.image ? (
                <Image src={user.image} alt={user.name ?? ""} width={32} height={32} />
              ) : (
                <span className="text-white text-sm font-bold">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-800 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500">
                {ROLE_LABELS[user.role]}
                {user.grade ? ` · Grade ${user.grade}` : ""}
              </p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600",
                    "hover:bg-red-50 transition-colors"
                  )}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
