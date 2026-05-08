"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSent(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f7eb] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-[#6db33f] rounded-xl flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1e5631]">Forgot password</h2>
          <p className="text-gray-500 text-sm mt-1">We'll send a reset link to your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">📧</div>
              <p className="font-medium text-gray-800">Check your email</p>
              <p className="text-sm text-gray-500">
                If <span className="font-medium">{email}</span> has an account, a reset link is on its way. Check your spam folder too.
              </p>
              <Link href="/login" className="block mt-4 text-sm text-[#6db33f] hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-[#6db33f] hover:bg-[#5a9a34] text-white" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </Button>
              <Link href="/login" className="block text-center text-sm text-gray-400 hover:text-gray-600">
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
