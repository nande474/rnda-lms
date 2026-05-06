import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewCourseForm } from "./new-course-form";

export default async function NewCoursePage() {
  const session = await auth();
  if (!session?.user || session.user.role === "STUDENT") redirect("/dashboard");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1e5631] mb-6">Create New Course</h1>
      <NewCourseForm teacherId={session.user.id} />
    </div>
  );
}
