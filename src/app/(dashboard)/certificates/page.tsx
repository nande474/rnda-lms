import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, SUBJECTS, SUBJECT_ICONS } from "@/lib/utils";
import { Award, Download } from "lucide-react";
import Link from "next/link";

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const certificates = await db.certificate.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: { teacher: { select: { name: true } } },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e5631]">My Certificates</h1>
        <p className="text-gray-500 text-sm mt-1">Your earned RNDA completion certificates</p>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Award size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No certificates yet</h3>
            <p className="text-sm text-gray-400 mb-4">
              Complete a course to earn your certificate.
            </p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border-2 border-[#6db33f] shadow-md overflow-hidden"
            >
              <div className="rnda-gradient px-6 pt-6 pb-10 text-white text-center">
                <p className="text-white/70 text-xs uppercase tracking-widest mb-1">
                  Certificate of Completion
                </p>
                <h2 className="text-xl font-bold">RNDA Learning Portal</h2>
                <p className="text-white/70 text-xs mt-1">
                  Regenerating Neighbourhood Development Agency
                </p>
              </div>

              <div className="-mt-6 mx-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
                <div className="text-center mb-4">
                  <Award size={32} className="text-[#6db33f] mx-auto mb-2" />
                  <p className="text-sm text-gray-500">This certifies that</p>
                  <p className="text-xl font-bold text-[#1e5631] my-1">{session.user.name}</p>
                  <p className="text-sm text-gray-500">has successfully completed</p>
                </div>

                <div className="bg-[#f0f7eb] rounded-lg p-3 text-center mb-4">
                  <span className="text-2xl block mb-1">{SUBJECT_ICONS[cert.course.subject] ?? "📚"}</span>
                  <p className="font-bold text-[#1e5631]">{cert.course.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {SUBJECTS[cert.course.subject as keyof typeof SUBJECTS]} · Grade {cert.course.grade}
                  </p>
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>Instructor: {cert.course.teacher.name}</span>
                  <span>Issued: {formatDate(cert.issuedAt)}</span>
                </div>
              </div>

              <div className="px-6 pb-5">
                <a href={`/api/certificates/${cert.courseId}/pdf`} download>
                  <Button variant="outline" size="sm" className="w-full gap-2 border-[#6db33f] text-[#1e5631] hover:bg-[#f0f7eb]">
                    <Download size={14} /> Download Certificate (PDF)
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
