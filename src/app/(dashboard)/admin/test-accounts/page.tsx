import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QuickLoginCards } from "./quick-login-cards";

export default async function TestAccountsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") redirect("/dashboard");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">Test Accounts</h1>
        <p className="text-gray-500 text-sm mt-1">
          Quick-switch between seeded test roles. Clicking a card signs you in as that account.
          Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/api/seed/test-users</code> first
          if accounts don&apos;t exist yet.
        </p>
      </div>
      <QuickLoginCards />
    </div>
  );
}
