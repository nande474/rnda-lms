import Link from "next/link";
import { Users, GraduationCap, BookOpen } from "lucide-react";

interface Props {
  siteId: number | null;
  stats: { teachers: number; students: number };
}

export function SiteAdminDashboard({ siteId, stats }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">
          {siteId ? `Site ${siteId} Dashboard` : "Site Dashboard"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage your site's teachers and students.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/siteadmin/users?role=TEACHER"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <BookOpen size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.teachers}</p>
            <p className="text-sm text-gray-500">Teachers</p>
          </div>
        </Link>

        <Link href="/siteadmin/users?role=STUDENT"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-[#f0f7eb] flex items-center justify-center">
            <GraduationCap size={22} className="text-[#6db33f]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.students}</p>
            <p className="text-sm text-gray-500">Students</p>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/siteadmin/users"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-[#f0f7eb] transition-colors">
            <Users size={18} className="text-[#6db33f]" />
            <span className="text-sm font-medium text-gray-700">Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
