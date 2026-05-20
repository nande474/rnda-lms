"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, User, ChevronDown, ClipboardList, BookMarked, Users, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn, getSiteName } from "@/lib/utils";

interface Notification { id: string; title: string; message: string; read: boolean; type: string; createdAt: string }

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    grade: number | null;
    siteId: number | null;
  };
  onMenuToggle?: () => void;
}

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  SUPERADMIN: { label: "Super Admin", color: "bg-purple-200 text-purple-900" },
  ADMIN:      { label: "Admin",       color: "bg-purple-100 text-purple-700" },
  SITEADMIN:  { label: "Site Admin",  color: "bg-orange-100 text-orange-700" },
  TEACHER:    { label: "Teacher",     color: "bg-blue-100 text-blue-700" },
  STUDENT:    { label: "Student",     color: "bg-[#e8f5d9] text-[#1e5631]" },
};

const NOTIF_ICON: Record<string, React.ReactNode> = {
  ASSIGNMENT: <ClipboardList size={13} className="text-blue-500" />,
  GRADE:      <BookMarked size={13} className="text-[#6db33f]" />,
  ATTENDANCE: <Users size={13} className="text-orange-500" />,
  SYSTEM:     <Bell size={13} className="text-gray-400" />,
};

export function Topbar({ user, onMenuToggle }: TopbarProps) {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [bellOpen, setBellOpen]         = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);

  const badge    = ROLE_BADGE[user.role] ?? ROLE_BADGE.STUDENT;
  const initials = (user.name ?? user.email ?? "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const unread   = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications ?? []));
  }, []);

  const openBell = () => {
    setBellOpen((v) => !v);
    if (!bellOpen && unread > 0) {
      fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
        .then(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))));
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 z-30 flex items-center px-4 sm:px-6 gap-3"
      style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e8f0e8" }}>

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#1e5631] hover:bg-[#f0f7eb] transition-colors lg:hidden shrink-0"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 flex items-center gap-2 min-w-0">
        <div>
          <p className="text-xs text-gray-400 leading-none mb-0.5">Welcome back</p>
          <p className="text-sm font-semibold text-[#1e5631] leading-none">{user.name ?? user.email}</p>
        </div>
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block", badge.color)}>
          {badge.label}
          {user.siteId ? ` · ${getSiteName(user.siteId)}` : ""}
          {user.grade  ? ` · Grade ${user.grade}` : ""}
        </span>
      </div>

      {/* Bell */}
      <div ref={bellRef} className="relative">
        <button
          onClick={openBell}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-[#f0f7eb] hover:text-[#1e5631] transition-colors"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        {bellOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setBellOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
              <div className="px-4 py-3 bg-[#f0f7eb] border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#1e5631]">Notifications</p>
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))} className="text-[10px] text-gray-400 hover:text-gray-600">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-gray-400">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={cn("px-4 py-3 flex gap-3", !n.read && "bg-[#f9fdf6]")}>
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        {NOTIF_ICON[n.type] ?? NOTIF_ICON.SYSTEM}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-gray-300 mt-1">{new Date(n.createdAt).toLocaleDateString("en-ZA")}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#6db33f] shrink-0 mt-1.5" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

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
                <div className="w-9 h-9 rounded-xl bg-[#1e5631] flex items-center justify-center text-white text-sm font-bold shadow-sm">{initials}</div>
                <div>
                  <p className="text-sm font-semibold text-[#1e5631] leading-tight truncate max-w-[120px]">{user.name ?? "User"}</p>
                  <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{user.email}</p>
                </div>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <User size={14} className="text-gray-400" /> My Profile
                </button>
                <div className="h-px bg-gray-100 mx-3 my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
