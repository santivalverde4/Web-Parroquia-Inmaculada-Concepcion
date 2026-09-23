"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login?error=missing");
  try {
    await signIn("credentials", { email, password, redirectTo: "/admin/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) redirect("/admin/login?error=invalid");
    throw error;
  }
}
