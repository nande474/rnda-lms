import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await resend.emails.send({
    from: "RNDA Learning Portal <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password — RNDA Learning Portal",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <div style="background:#6db33f;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <h1 style="color:#fff;margin:0;font-size:24px">RNDA Learning Portal</h1>
        </div>
        <h2 style="color:#1e5631">Reset your password</h2>
        <p style="color:#555">We received a request to reset your password. Click the button below to choose a new one.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#6db33f;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;margin:16px 0">
          Reset Password
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.</p>
      </div>
    `,
  });
}
