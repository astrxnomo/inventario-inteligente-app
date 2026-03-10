import { Tables } from "@/lib/supabase/types"

export type Cabinet = Tables<"cabinets"> & {
  _count: {
    inventory_items: number
    active_sessions: number
  }
}
