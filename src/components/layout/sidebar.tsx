"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BookOpen, Users, BarChart2,
  Award, GraduationCap, Settings, ChevronRight, PlusCircle, ClipboardList, BookMarked, X,
  Megaphone, Shield, TrendingUp, Library,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { href: "/dashboard",    label: "Dashboard",      icon: <LayoutDashboard size={17} /> },
  { href: "/courses",      label: "Browse Courses", icon: <BookOpen size={17} /> },
  { href: "/my-courses",   label: "My Courses",     icon: <GraduationCap size={17} /> },
  { href: "/progress",     label: "My Progress",    icon: <BarChart2 size={17} /> },
  { href: "/my-grades",    label: "My Grades",      icon: <BookMarked size={17} /> },
  { href: "/certificates", label: "Certificates",   icon: <Award size={17} /> },
];

const teacherNav: NavItem[] = [
  { href: "/dashboard",         label: "Dashboard",   icon: <LayoutDashboard size={17} /> },
  { href: "/teach/courses",     label: "My Courses",  icon: <BookOpen size={17} /> },
  { href: "/teach/courses/new", label: "New Course",  icon: <PlusCircle size={17} /> },
  { href: "/teach/students",    label: "Students",    icon: <Users size={17} /> },
  { href: "/teach/attendance",  label: "Attendance",  icon: <ClipboardList size={17} /> },
  { href: "/teach/gradebook",   label: "Gradebook",   icon: <BookMarked size={17} /> },
];

const adminNav: NavItem[] = [
  { href: "/dashboard",              label: "Dashboard",     icon: <LayoutDashboard size={17} /> },
  { href: "/admin/users",            label: "Users",         icon: <Users size={17} /> },
  { href: "/admin/courses",          label: "All Courses",   icon: <BookOpen size={17} /> },
  { href: "/admin/enrollments",      label: "Enrollments",   icon: <GraduationCap size={17} /> },
  { href: "/admin/curriculum",       label: "Curriculum",    icon: <Library size={17} /> },
  { href: "/admin/analytics",        label: "Analytics",     icon: <TrendingUp size={17} /> },
  { href: "/admin/announcements",    label: "Announcements", icon: <Megaphone size={17} /> },
  { href: "/admin/settings",         label: "Settings",      icon: <Settings size={17} /> },
];

const superadminNav: NavItem[] = [
  ...adminNav.filter((n) => n.href !== "/admin/settings"),
  { href: "/admin/audit",    label: "Audit Logs", icon: <Shield size={17} /> },
  { href: "/admin/settings", label: "Settings",   icon: <Settings size={17} /> },
];

const siteadminNav: NavItem[] = [
  { href: "/dashboard",       label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { href: "/siteadmin/users", label: "My Users",  icon: <Users size={17} /> },
];

const ROLE_LABEL: Record<string, string> = {
  SUPERADMIN: "Administration",
  ADMIN:      "Administration",
  SITEADMIN:  "Site Management",
  TEACHER:    "Teaching",
  STUDENT:    "Learning",
};

interface SidebarProps {
  role: string;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role, open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navItems =
    role === "SUPERADMIN" ? superadminNav :
    role === "ADMIN"      ? adminNav :
    role === "SITEADMIN"  ? siteadminNav :
    role === "TEACHER"    ? teacherNav : studentNav;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-64 flex flex-col z-40 overflow-hidden transition-transform duration-300",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ background: "linear-gradient(160deg,#163d24 0%,#1e5631 60%,#1a4a2a 100%)" }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center pt-7 pb-6 px-5 border-b border-white/10">
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 lg:hidden"
        >
          <X size={16} />
        </button>

        <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden mb-3">
          <Image
            src="/logo.png"
            alt="RNDA"
            width={72}
            height={72}
            className="object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <p className="text-white font-bold text-sm tracking-wide">Learning Portal</p>
        <p className="text-white/50 text-[10px] text-center leading-tight mt-1 px-2">
          Regenerating Neighbourhood<br />Development Agency
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-0.5">
        <p className="text-white/30 text-[10px] uppercase tracking-widest px-3 pb-3 font-medium">
          {ROLE_LABEL[role] ?? "Menu"}
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#6db33f] text-white shadow-md shadow-black/20"
                  : "text-white/65 hover:text-white hover:bg-white/10"
              )}
            >
              <span className={cn("shrink-0", active ? "text-white" : "text-white/50")}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={13} className="text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6db33f] animate-pulse" />
          <p className="text-white/30 text-[10px] tracking-wide">RNDA · South Africa</p>
        </div>
      </div>
    </aside>
  );
}
