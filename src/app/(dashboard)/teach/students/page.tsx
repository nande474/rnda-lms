import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Users, AlertCircle } from "lucide-react";
import { AddStudentForm } from "./add-student-form";
import { formatDate } from "@/lib/utils";

export default async function TeachStudentsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const teacherGrade = session.user.grade;

  if (!teacherGrade) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1e5631]">My Students</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle size={20} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">No grade assigned</p>
            <p className="text-sm text-amber-700 mt-1">
              You have not been allocated to a grade yet. Contact your administrator to have a grade assigned to your profile before you can add students.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const students = await db.user.findMany({
    where: { role: "STUDENT", grade: teacherGrade },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e5631]">My Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">Grade {teacherGrade} · {students.length} student{students.length !== 1 ? "s" : ""}</p>
        </div>
        <AddStudentForm grade={teacherGrade} />
      </div>

      {students.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 bg-[#f0f7eb] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users size={22} className="text-[#6db33f]" />
          </div>
          <p className="font-medium text-gray-700">No students yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first Grade {teacherGrade} student using the button above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e8f5d9] flex items-center justify-center text-[#1e5631] text-xs font-bold">
                        {student.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600">Grade {student.grade}</td>
                  <td className="px-6 py-3 text-xs text-gray-400">{formatDate(student.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
