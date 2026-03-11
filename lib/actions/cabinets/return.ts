import { returnSchema } from "@/lib/schemas/cabinets"
import { createClient } from "@/lib/supabase/client"
import type { ActionResult, ReturnPayload } from "@/lib/types/cabinets"

export async function returnCabinetItems(
  payload: ReturnPayload,
): Promise<ActionResult<void>> {
  const parsed = returnSchema.safeParse(payload)
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    }
  }

  const supabase = createClient()
  const { error } = await supabase.rpc("return_items", {
    p_session_id: payload.sessionId,
    p_user_id: payload.userId,
  })

  if (error) return { data: null, error: error.message }
  return { data: undefined, error: null }
}
