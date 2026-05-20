import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuditLogViewer } from "./audit-log-viewer";

export default async function AuditLogPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">Audit Logs</h1>
        <p className="text-gray-500 text-sm mt-1">Full record of admin actions performed on the platform</p>
      </div>
      <AuditLogViewer />
    </div>
  );
}
