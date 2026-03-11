import { createClient } from "@/lib/supabase/client"
import type { ActionResult, InventoryItem } from "@/lib/types/cabinets"

export async function fetchInventoryItems(
  cabinetId: string,
): Promise<ActionResult<InventoryItem[]>> {
  const supabase = createClient()

  const [{ data: rawItems, error }, { data: sessions }] = await Promise.all([
    supabase
      .from("inventory_items")
      .select("*")
      .eq("cabinet_id", cabinetId)
      .order("name"),
    supabase
      .from("cabinet_sessions")
      .select("id")
      .eq("cabinet_id", cabinetId)
      .is("closed_at", null),
  ])

  if (error) return { data: null, error: error.message }

  const inUseMap: Record<string, number> = {}
  const sessionIds = (sessions ?? []).map((s) => s.id)

  if (sessionIds.length > 0) {
    const { data: sessionItems } = await supabase
      .from("session_items")
      .select("item_id, quantity")
      .in("session_id", sessionIds)
      .eq("action", "withdrawn")

    for (const row of sessionItems ?? []) {
      inUseMap[row.item_id] = (inUseMap[row.item_id] ?? 0) + row.quantity
    }
  }

  return {
    data: (rawItems ?? []).map((item) => ({
      ...item,
      in_use: inUseMap[item.id] ?? 0,
    })),
    error: null,
  }
}
