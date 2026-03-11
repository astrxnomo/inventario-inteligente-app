import { createClient } from "@/lib/supabase/server"
import type { Cabinet } from "@/lib/types/cabinets"

export async function getCabinetsWithCounts(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<Cabinet[]> {
  const [cabinetsRes, itemCountsRes, activeSessionsRes] = await Promise.all([
    supabase.from("cabinets").select("*").order("name"),
    supabase.from("inventory_items").select("cabinet_id"),
    supabase
      .from("cabinet_sessions")
      .select("cabinet_id")
      .is("closed_at", null),
  ])

  const itemCountMap: Record<string, number> = {}
  const sessionCountMap: Record<string, number> = {}

  for (const row of itemCountsRes.data ?? []) {
    itemCountMap[row.cabinet_id] = (itemCountMap[row.cabinet_id] ?? 0) + 1
  }
  for (const row of activeSessionsRes.data ?? []) {
    sessionCountMap[row.cabinet_id] = (sessionCountMap[row.cabinet_id] ?? 0) + 1
  }

  return (cabinetsRes.data ?? []).map((c) => ({
    ...c,
    _count: {
      inventory_items: itemCountMap[c.id] ?? 0,
      active_sessions: sessionCountMap[c.id] ?? 0,
    },
  }))
}
