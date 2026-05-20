"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { credentialsSignIn } from "@/lib/actions";
import { useSearchParams } from "next/navigation";

const TEST_ACCOUNTS = [
  { label: "Admin", email: "admin@rnda", role: "ADMIN" },
  { label: "Teacher 1", email: "teacher1@rnda", role: "TEACHER" },
  { label: "Teacher 2", email: "teacher2@rnda", role: "TEACHER" },
  { label: "Teacher 3", email: "teacher3@rnda", role: "TEACHER" },
  { label: "Teacher 4", email: "teacher4@rnda", role: "TEACHER" },
  { label: "Teacher 5", email: "teacher5@rnda", role: "TEACHER" },
  { label: "Student 1", email: "student1@rnda", role: "STUDENT" },
  { label: "Student 2", email: "student2@rnda", role: "STUDENT" },
  { label: "Student 3", email: "student3@rnda", role: "STUDENT" },
  { label: "Student 4", email: "student4@rnda", role: "STUDENT" },
  { label: "Student 5", email: "student5@rnda", role: "STUDENT" },
  { label: "Student 6", email: "student6@rnda", role: "STUDENT" },
  { label: "Student 7", email: "student7@rnda", role: "STUDENT" },
  { label: "Student 8", email: "student8@rnda", role: "STUDENT" },
  { label: "Student 9", email: "student9@rnda", role: "STUDENT" },
  { label: "Student 10", email: "student10@rnda", role: "STUDENT" },
  { label: "Student 11", email: "student11@rnda", role: "STUDENT" },
  { label: "Student 12", email: "student12@rnda", role: "STUDENT" },
  { label: "Student 13", email: "student13@rnda", role: "STUDENT" },
  { label: "Student 14", email: "student14@rnda", role: "STUDENT" },
  { label: "Student 15", email: "student15@rnda", role: "STUDENT" },
  { label: "Student 16", email: "student16@rnda", role: "STUDENT" },
  { label: "Student 17", email: "student17@rnda", role: "STUDENT" },
  { label: "Student 18", email: "student18@rnda", role: "STUDENT" },
  { label: "Student 19", email: "student19@rnda", role: "STUDENT" },
  { label: "Student 20", email: "student20@rnda", role: "STUDENT" },
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  TEACHER: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  STUDENT: "bg-green-100 text-green-700 hover:bg-green-200",
};

function PasswordInput({
  placeholder,
  value,
  onChange,
  disabled,
  required,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        tabIndex={-1}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export function LoginForm() {
  const params = useSearchParams();
  const authError = params.get("error");

  const [loading, setLoading] = useState(false);
  const [signingInAs, setSigningInAs] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleQuickSignIn = async (email: string) => {
    setSigningInAs(email);
    setError("");
    const result = await credentialsSignIn(email, "Rnda@2024!");
    if (result?.error) {
      setError(result.error);
      setSigningInAs("");
    }
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await credentialsSignIn(form.email, form.password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center lg:text-left">
        <div className="w-12 h-12 bg-[#6db33f] rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0">
          <span className="text-white font-bold text-xl">R</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1e5631]">Sign in</h2>
        <p className="text-gray-500 text-sm mt-1">Access the RNDA Learning Portal</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        {authError === "AccessDenied" && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
            Your Google account has not been registered. Contact your administrator.
          </div>
        )}

        <Button
          onClick={handleGoogle}
          disabled={loading || !!signingInAs}
          variant="outline"
          className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
          size="lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleCredentials} className="space-y-3">
          <Input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={set("email")}
            required
            disabled={loading}
          />
          <PasswordInput
            placeholder="Password"
            value={form.password}
            onChange={set("password")}
            required
            disabled={loading}
          />

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-[#6db33f]">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-[#6db33f] hover:bg-[#5a9a34] text-white"
            size="lg"
            disabled={loading || !!signingInAs}
          >
            {loading ? "Please wait…" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400">
          No account? Contact your administrator.
        </p>
      </div>

      {/* Test accounts panel */}
      <div className="mt-4 bg-white rounded-2xl border border-dashed border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowTestAccounts((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-500 hover:bg-gray-50"
        >
          <span className="font-medium">🧪 Test accounts</span>
          {showTestAccounts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showTestAccounts && (
          <div className="px-4 pb-4 space-y-2">
            <p className="text-xs text-gray-400 mb-3">Click any account to sign in instantly</p>
            <div className="flex flex-wrap gap-2">
              {TEST_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleQuickSignIn(account.email)}
                  disabled={!!signingInAs}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${ROLE_COLORS[account.role]} ${signingInAs === account.email ? "opacity-50" : ""}`}
                >
                  {signingInAs === account.email ? "Signing in…" : account.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
