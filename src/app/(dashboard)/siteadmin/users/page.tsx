import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SiteAdminUsersTable } from "./siteadmin-users-table";
import { SiteAdminCreateUserForm } from "./create-user-form";

export default async function SiteAdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SITEADMIN") redirect("/dashboard");

  const siteId = session.user.siteId;
  if (!siteId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[#1e5631]">My Users</h1>
        <p className="text-red-500 text-sm">You are not assigned to a site. Contact the administrator.</p>
      </div>
    );
  }

  const users = await db.user.findMany({
    where: { siteId, role: { in: ["TEACHER", "STUDENT"] } },
    include: { enrollments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e5631]">Site {siteId} Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} user{users.length !== 1 ? "s" : ""} in your site</p>
        </div>
        <SiteAdminCreateUserForm />
      </div>
      <SiteAdminUsersTable users={users} />
    </div>
  );
}
