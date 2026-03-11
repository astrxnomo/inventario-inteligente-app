"use server"

import { resetPasswordSchema } from "@/lib/schemas/auth"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { type AuthState } from "./shared"

export type { AuthState }

export async function resetPasswordAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const result = resetPasswordSchema.safeParse({ email: formData.get("email") })

  if (!result.success) {
    return { fieldErrors: { email: result.error.issues[0]?.message } }
  }

  const origin = (await headers()).get("origin") ?? ""
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(
    result.data.email,
    {
      redirectTo: `${origin}/auth/callback?next=/reset-password/update`,
    },
  )

  if (error) return { error: error.message }

  return { success: true, successEmail: result.data.email }
}
