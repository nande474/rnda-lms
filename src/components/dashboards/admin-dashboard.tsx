import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, GraduationCap, Settings } from "lucide-react";

interface AdminDashboardProps {
  stats: { users: number; courses: number; enrollments: number };
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">RNDA Learning Portal Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: stats.users, icon: <Users size={22} className="text-[#6db33f]" />, bg: "bg-[#f0f7eb]", href: "/admin/users" },
          { label: "Courses", value: stats.courses, icon: <BookOpen size={22} className="text-blue-600" />, bg: "bg-blue-50", href: "/admin/courses" },
          { label: "Enrollments", value: stats.enrollments, icon: <GraduationCap size={22} className="text-purple-600" />, bg: "bg-purple-50", href: "/admin/enrollments" },
        ].map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 py-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Manage Users", desc: "View, promote or remove portal users", href: "/admin/users", icon: <Users size={20} /> },
          { label: "Manage Courses", desc: "Review and publish courses", href: "/admin/courses", icon: <BookOpen size={20} /> },
          { label: "Enrollments", desc: "Manage student-course enrollments", href: "/admin/enrollments", icon: <GraduationCap size={20} /> },
          { label: "Settings", desc: "Configure portal settings", href: "/admin/settings", icon: <Settings size={20} /> },
        ].map((item) => (
          <Card key={item.label} className="hover:shadow-md transition-shadow">
            <CardContent className="py-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[#6db33f]">{item.icon}</div>
                <h3 className="font-semibold text-gray-800">{item.label}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
              <Link href={item.href}>
                <Button variant="outline" size="sm">Go to {item.label}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
