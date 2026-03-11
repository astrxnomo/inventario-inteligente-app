"use server"

import { createClient } from "@/lib/supabase/server"
import type { AuthState } from "./shared"

export async function updateProfileAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = (formData.get("name") as string | null)?.trim() ?? ""

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "No autenticado" }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: name || null })
    .eq("id", user.id)

  if (error) return { error: "No se pudo guardar el perfil" }
  return { success: true }
}
