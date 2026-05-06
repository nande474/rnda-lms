import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1e5631]">Settings</h1>
      <Card>
        <CardHeader><h2 className="font-semibold text-gray-800">Portal Information</h2></CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Organisation</span>
            <span className="font-medium">Regenerating Neighbourhood Development Agency</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Focus Area</span>
            <span className="font-medium">Afterschool STEM Tutoring</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Grades Covered</span>
            <span className="font-medium">Grade 5 – Grade 12</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Subjects</span>
            <span className="font-medium">Mathematics, Physical Science, Life Science, Computer Science, Technology</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Authentication</span>
            <span className="font-medium">Google OAuth</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
