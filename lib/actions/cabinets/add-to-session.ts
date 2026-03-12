import { createClient } from "@/lib/supabase/client"
import type { ActionResult } from "@/lib/types/cabinets"

export async function addItemsToSession(payload: {
  sessionId: string
  userId: string
  items: Array<{ item_id: string; quantity: number }>
}): Promise<ActionResult<void>> {
  const supabase = createClient()

  const { error } = await supabase.rpc("add_items_to_session", {
    p_session_id: payload.sessionId,
    p_user_id: payload.userId,
    p_items: payload.items,
  })

  if (error) return { data: null, error: error.message }
  return { data: undefined, error: null }
}
