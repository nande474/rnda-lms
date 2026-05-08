import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await db.user.findUnique({ where: { email } });

  // Always return success to avoid leaking which emails are registered
  if (!user || !user.password) {
    return NextResponse.json({ ok: true });
  }

  // Delete any existing tokens for this email
  await db.passwordResetToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.passwordResetToken.create({ data: { email, token, expires } });

  const baseUrl = process.env.NEXTAUTH_URL ?? "https://rnda-lms.site";
  await sendPasswordResetEmail(email, `${baseUrl}/reset-password?token=${token}`);

  return NextResponse.json({ ok: true });
}
