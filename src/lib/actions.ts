"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function credentialsSignIn(email: string, password: string) {
  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error; // re-throw the redirect so Next.js handles it
  }
}
