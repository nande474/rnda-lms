import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — RNDA LMS",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/login"
            className="text-sm text-green-700 hover:text-green-900 font-medium"
          >
            ← Back to Login
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
          <div className="mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full rnda-gradient flex items-center justify-center shrink-0">
                <span className="text-lg font-black text-white">R</span>
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                RNDA Learning Portal
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">Last Updated: June 9, 2026</p>
          </div>

          <div className="prose prose-gray prose-sm sm:prose-base max-w-none space-y-8">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                RNDA ("we," "our," or "us") is committed to protecting the privacy and security of our
                learners, teachers, and administrators. This Privacy Policy explains how we collect, use,
                and safeguard the information you provide through the RNDA LMS platform. By using our
                services, you consent to the data practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We collect information necessary to facilitate a high-quality academic environment, including:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">User Information:</span>
                  Name, school affiliation, grade level, and contact information.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">Academic Data:</span>
                  Attendance records, quiz scores, assignment submissions, and progress tracking.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">Technical Data:</span>
                  Usage statistics, IP addresses, and device information to improve platform performance
                  and security.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We use the collected data strictly for educational purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-600">
                <li>Managing student enrollment and class assignments.</li>
                <li>
                  Tracking academic performance and attendance to provide personalized support.
                </li>
                <li>
                  Communicating important updates regarding sessions, assignments, and platform
                  improvements.
                </li>
                <li>
                  Generating anonymous reports for stakeholders to demonstrate educational impact.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                4. Storage and Handling of Student Media
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                In the course of your studies, you may upload various files to the platform, including
                assignment documents, project presentations, and images.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">Storage:</span>
                  These files are stored in our secure cloud storage environment. Access is strictly
                  limited to authorized teachers and administrators responsible for your course evaluation.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">Usage:</span>
                  Student media is used exclusively for educational grading, feedback, and academic
                  record-keeping.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">Retention:</span>
                  We retain these files for the duration of the academic year. Upon completion of your
                  studies or upon request, these files are eligible for archival or secure deletion in
                  accordance with our data retention policy.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">Prohibited Content:</span>
                  Users are strictly prohibited from uploading personal content unrelated to their
                  coursework. Any media uploaded to the platform is subject to monitoring to ensure it
                  aligns with our community guidelines and academic standards.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Sharing and Security</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">No Third-Party Selling:</span>
                  We do not sell, trade, or rent your personal information to third parties.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">Data Protection:</span>
                  We utilize industry-standard encryption and secure cloud infrastructure (Neon/Vercel)
                  to protect your data.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-gray-800 shrink-0">Access Control:</span>
                  Access to sensitive academic data is restricted by role-based hierarchy (SuperAdmin,
                  Admin, Teacher, Student).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                6. Your Rights (POPIA Compliance)
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Under the Protection of Personal Information Act (POPIA), you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-600">
                <li>Access the personal information we hold about you.</li>
                <li>Request corrections to inaccurate information.</li>
                <li>
                  Request the deletion of your data, subject to legal and academic retention
                  requirements.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use essential cookies to manage user authentication and ensure the platform functions
                correctly. You may choose to disable cookies in your browser, though this may limit your
                ability to access certain features of the LMS.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this policy periodically. Any significant changes will be communicated via
                the platform dashboard or email.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions regarding this Privacy Policy or the handling of your data, please
                contact our administrative office at{" "}
                <a
                  href="mailto:info@rnda.org.za"
                  className="text-green-700 hover:text-green-900 font-medium"
                >
                  info@rnda.org.za
                </a>
                .
              </p>
            </section>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} Regenerating Neighbourhood Development Agency. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
