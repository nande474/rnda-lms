import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 rnda-gradient flex-col items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl font-black text-white">R</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">RNDA Learning Portal</h1>
          <p className="text-white/80 text-lg mb-8">
            Regenerating Neighbourhood Development Agency
          </p>
          <p className="text-white/60 text-sm">
            Afterschool STEM tutoring for Grades 5–12.
            Empowering the next generation of thinkers, builders, and innovators.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Grades", value: "5–12" },
              { label: "Subjects", value: "5 STEM" },
              { label: "Focus", value: "NPO" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <footer className="px-8 py-4 text-center text-xs text-gray-400 border-t border-gray-200">
          <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">
            Privacy Policy
          </Link>
          <span className="mx-2">·</span>
          <span>© {new Date().getFullYear()} RNDA</span>
        </footer>
      </div>
    </div>
  );
}
