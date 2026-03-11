"use server"

import { loginSchema } from "@/lib/schemas/auth"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { collectFieldErrors, type AuthState } from "./shared"

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!result.success) {
    return { fieldErrors: collectFieldErrors(result.error.issues) }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(result.data)
  if (error) return { error: "Email o contraseña incorrectos" }

  redirect("/")
}
