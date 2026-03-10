import type { Tables } from "@/lib/supabase/types"

export type Mode = "loading" | "browse" | "returning"

export type Selections = Record<string, number>

export type InventoryItem = Tables<"inventory_items">

export interface WithdrawnItem {
  session_item_id: string
  item_id: string
  name: string
  unit: string | null
  quantity: number
}
