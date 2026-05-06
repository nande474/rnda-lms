"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart2,
  Award,
  GraduationCap,
  Settings,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/courses", label: "Browse Courses", icon: <BookOpen size={18} /> },
  { href: "/my-courses", label: "My Courses", icon: <GraduationCap size={18} /> },
  { href: "/progress", label: "My Progress", icon: <BarChart2 size={18} /> },
  { href: "/certificates", label: "Certificates", icon: <Award size={18} /> },
];

const teacherNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/teach/courses", label: "My Courses", icon: <BookOpen size={18} /> },
  { href: "/teach/courses/new", label: "Create Course", icon: <GraduationCap size={18} /> },
  { href: "/teach/students", label: "Students", icon: <Users size={18} /> },
];

const adminNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { href: "/admin/courses", label: "All Courses", icon: <BookOpen size={18} /> },
  { href: "/admin/enrollments", label: "Enrollments", icon: <GraduationCap size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const navItems =
    role === "ADMIN" ? adminNav : role === "TEACHER" ? teacherNav : studentNav;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1e5631] flex flex-col z-40">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-10 h-10 bg-[#6db33f] rounded-lg flex items-center justify-center text-white font-bold text-lg">
          R
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">RNDA</p>
          <p className="text-white/60 text-xs">Learning Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-white/40 text-xs uppercase tracking-wider px-3 pb-2">
          {role === "ADMIN" ? "Administration" : role === "TEACHER" ? "Teaching" : "Learning"}
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group",
                active
                  ? "bg-[#6db33f] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <p className="text-white/40 text-[10px] text-center">
          Regenerating Neighbourhood Development Agency
        </p>
      </div>
    </aside>
  );
}
