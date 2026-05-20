import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { UsersTable } from "./users-table";
import { CreateUserForm } from "./create-user-form";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) redirect("/dashboard");

  const users = await db.user.findMany({
    include: { enrollments: true, taughtCourses: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e5631]">Users</h1>
        <CreateUserForm currentUserRole={session.user.role} />
      </div>
      <UsersTable users={users} currentUserRole={session.user.role} />
    </div>
  );
}
