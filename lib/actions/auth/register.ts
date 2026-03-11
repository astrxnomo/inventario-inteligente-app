"use server"

import { registerSchema } from "@/lib/schemas/auth"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { collectFieldErrors, type AuthState } from "./shared"

export type { AuthState }

export async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const result = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  })

  if (!result.success) {
    return { fieldErrors: collectFieldErrors(result.error.issues) }
  }

  const origin = (await headers()).get("origin") ?? ""
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  })

  if (error) return { error: error.message }
  if (data.session) redirect("/")

  return { success: true, successEmail: result.data.email }
}
