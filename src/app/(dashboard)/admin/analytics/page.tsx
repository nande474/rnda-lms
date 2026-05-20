import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, BookOpen, Award, TrendingUp, Activity, BarChart2 } from "lucide-react";
import { SITES, SUBJECTS } from "@/lib/utils";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const now     = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Build monthly enrollment buckets for the last 6 months
  const months: { label: string; start: Date; end: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    months.push({
      label: d.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" }),
      start,
      end,
    });
  }

  const [
    totalUsers,
    usersByRole,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    activeLearners,
    certificates,
    recentEnrollments,
    submissionsAll,
    enrollmentsByMonth,
    enrollmentsBySite,
    coursesBySubject,
  ] = await Promise.all([
    db.user.count(),
    db.user.groupBy({ by: ["role"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    db.course.count(),
    db.course.count({ where: { published: true } }),
    db.enrollment.count(),
    db.lessonProgress.findMany({
      where:  { completedAt: { gte: last24h } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    db.certificate.count(),
    db.enrollment.count({ where: { enrolledAt: { gte: last30d } } }),
    db.assignmentSubmission.findMany({
      where:  { grade: { not: null } },
      select: { grade: true, assignment: { select: { maxScore: true } } },
    }),
    Promise.all(
      months.map((m) =>
        db.enrollment.count({ where: { enrolledAt: { gte: m.start, lte: m.end } } })
      )
    ),
    db.user.groupBy({
      by: ["siteId"],
      _count: { id: true },
      where: { role: "STUDENT", siteId: { not: null } },
      orderBy: { _count: { id: "desc" } },
    }),
    db.course.groupBy({ by: ["subject"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
  ]);

  const passRate =
    submissionsAll.length > 0
      ? Math.round(
          (submissionsAll.filter(
            (s) => s.grade !== null && s.grade / s.assignment.maxScore >= 0.5
          ).length /
            submissionsAll.length) *
            100
        )
      : null;

  const maxMonthly = Math.max(...enrollmentsByMonth, 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">Impact Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide statistics for RNDA Digital Academy</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: <Users size={18} />, label: "Total Users",      value: totalUsers },
          { icon: <BookOpen size={18} />, label: "Courses",       value: publishedCourses + " / " + totalCourses },
          { icon: <TrendingUp size={18} />, label: "Enrollments", value: totalEnrollments },
          { icon: <Activity size={18} />, label: "Active (24h)",  value: activeLearners.length },
          { icon: <Award size={18} />, label: "Certificates",     value: certificates },
          { icon: <BarChart2 size={18} />, label: "Pass Rate",    value: passRate !== null ? `${passRate}%` : "—" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-2 text-[#6db33f] mb-2">{kpi.icon}</div>
              <div className="text-2xl font-bold text-[#1e5631]">{kpi.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly enrollment trend */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Monthly Enrolments (last 6 months)</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {months.map((m, i) => (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-[#6db33f] transition-all"
                    style={{ height: `${Math.round((enrollmentsByMonth[i] / maxMonthly) * 100)}%`, minHeight: "4px" }}
                  />
                  <span className="text-[10px] text-gray-500">{m.label}</span>
                  <span className="text-xs font-semibold text-[#1e5631]">{enrollmentsByMonth[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">{recentEnrollments} new enrolments in the last 30 days</p>
          </CardContent>
        </Card>

        {/* Users by role */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Users by Role</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usersByRole.map((row) => {
                const pct = Math.round((row._count.id / totalUsers) * 100);
                return (
                  <div key={row.role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium capitalize">{row.role.toLowerCase()}</span>
                      <span className="text-gray-500">{row._count.id} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#6db33f] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Students by school */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Students by School</h2>
          </CardHeader>
          <CardContent>
            {enrollmentsBySite.length === 0 ? (
              <p className="text-sm text-gray-400">No school assignments yet</p>
            ) : (
              <div className="space-y-3">
                {enrollmentsBySite.map((row) => {
                  const site = row.siteId ? SITES[row.siteId] : null;
                  const pct  = Math.round((row._count.id / (enrollmentsBySite[0]._count.id || 1)) * 100);
                  return (
                    <div key={row.siteId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">
                          {site?.shortName ?? `Site ${row.siteId}`}
                        </span>
                        <span className="text-gray-500">{row._count.id} students</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1e5631] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Courses by subject */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">Courses by Subject</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coursesBySubject.map((row) => {
                const label = SUBJECTS[row.subject as keyof typeof SUBJECTS] ?? row.subject;
                const pct   = Math.round((row._count.id / totalCourses) * 100);
                return (
                  <div key={row.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{label}</span>
                      <span className="text-gray-500">{row._count.id} courses ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#6db33f] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
