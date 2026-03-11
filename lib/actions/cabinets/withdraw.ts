import { withdrawSchema } from "@/lib/schemas/cabinets"
import { createClient } from "@/lib/supabase/client"
import type { ActionResult, WithdrawPayload } from "@/lib/types/cabinets"

export async function withdrawCabinetItems(
  payload: WithdrawPayload,
): Promise<ActionResult<string>> {
  const parsed = withdrawSchema.safeParse(payload)
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    }
  }

  const supabase = createClient()

  // Signal the physical cabinet (ESP32) to unlock
  await supabase.channel("esp32-commands").send({
    type: "broadcast",
    event: "open",
    payload: { cabinet_id: payload.cabinetId },
  })

  const { data, error } = await supabase.rpc("withdraw_items", {
    p_cabinet_id: payload.cabinetId,
    p_user_id: payload.userId,
    p_items: payload.items,
  })

  if (error || !data) {
    return { data: null, error: error?.message ?? "Error al retirar artículos" }
  }
  return { data, error: null }
}
