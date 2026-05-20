import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const now = new Date();
  const announcements = await db.announcement.findMany({
    where: {
      active: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: { id: true, title: true, message: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell role={session.user.role} user={session.user} announcements={announcements}>
      {children}
    </DashboardShell>
  );
}
