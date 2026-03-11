"use server"

import { updatePasswordSchema } from "@/lib/schemas/auth"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { collectFieldErrors, type AuthState } from "./shared"

export async function updatePasswordAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const result = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  })

  if (!result.success) {
    return { fieldErrors: collectFieldErrors(result.error.issues) }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  })
  if (error) return { error: error.message }

  redirect("/")
}
