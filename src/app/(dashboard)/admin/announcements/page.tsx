import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnnouncementsManager } from "./announcements-manager";

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">Announcements</h1>
        <p className="text-gray-500 text-sm mt-1">Broadcast messages visible to all platform users</p>
      </div>
      <AnnouncementsManager />
    </div>
  );
}
