"use client"

import { createClient } from "@/lib/supabase/client"
import type { Cabinet } from "@/lib/types/cabinet"
import type { InventoryItem, Mode, Selections, WithdrawnItem } from "@/lib/types/inventory"
import { useCallback, useEffect, useRef, useState } from "react"

export function useCabinetDetail(
  cabinet: Cabinet | null,
  userId: string,
  open: boolean,
) {
  const [mode, setMode] = useState<Mode>("loading")
  const [items, setItems] = useState<InventoryItem[]>([])
  const [withdrawnItems, setWithdrawnItems] = useState<WithdrawnItem[]>([])
  const [selections, setSelections] = useState<Selections>({})
  const [submitting, setSubmitting] = useState(false)
  const sessionIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!open || !cabinet) {
      setMode("loading")
      setItems([])
      setWithdrawnItems([])
      setSelections({})
      sessionIdRef.current = null
      return
    }

    async function load() {
      setMode("loading")
      const supabase = createClient()

      // Check for an existing open session by this user for this cabinet
      const { data: session } = await supabase
        .from("cabinet_sessions")
        .select("id")
        .eq("cabinet_id", cabinet!.id)
        .eq("user_id", userId)
        .is("closed_at", null)
        .maybeSingle()

      if (session) {
        sessionIdRef.current = session.id

        const { data: sessionItems } = await supabase
          .from("session_items")
          .select("id, item_id, quantity, inventory_items(name, unit)")
          .eq("session_id", session.id)
          .eq("action", "withdrawn")

        const withdrawn: WithdrawnItem[] = (sessionItems ?? []).map((si) => ({
          session_item_id: si.id,
          item_id: si.item_id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: (si.inventory_items as any)?.name ?? "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          unit: (si.inventory_items as any)?.unit ?? null,
          quantity: si.quantity,
        }))

        setWithdrawnItems(withdrawn)
        setMode("returning")
      } else {
        const { data: inventoryItems } = await supabase
          .from("inventory_items")
          .select("*")
          .eq("cabinet_id", cabinet!.id)
          .order("name")

        setItems(inventoryItems ?? [])
        setMode("browse")
      }
    }

    load()
  }, [open, cabinet, userId])

  const setQty = useCallback((itemId: string, qty: number) => {
    setSelections((prev) => {
      if (qty <= 0) {
        const next = { ...prev }
        delete next[itemId]
        return next
      }
      return { ...prev, [itemId]: qty }
    })
  }, [])

  const totalSelected = Object.values(selections).reduce((a, b) => a + b, 0)

  async function handleWithdraw() {
    if (!cabinet || totalSelected === 0) return
    setSubmitting(true)

    const supabase = createClient()

    // Broadcast open command to ESP32
    await supabase.channel("esp32-commands").send({
      type: "broadcast",
      event: "open",
      payload: { cabinet_id: cabinet.id },
    })

    const itemsPayload = Object.entries(selections).map(([item_id, quantity]) => ({
      item_id,
      quantity,
    }))

    const { data, error } = await supabase.rpc("withdraw_items", {
      p_cabinet_id: cabinet.id,
      p_user_id: userId,
      p_items: itemsPayload,
    })

    setSubmitting(false)

    if (error || !data) {
      const { toast } = await import("sonner")
      toast.error("Error al retirar artículos")
      return
    }

    sessionIdRef.current = data

    const withdrawn: WithdrawnItem[] = items
      .filter((item) => selections[item.id])
      .map((item) => ({
        session_item_id: "",
        item_id: item.id,
        name: item.name,
        unit: item.unit,
        quantity: selections[item.id],
      }))

    setWithdrawnItems(withdrawn)
    setSelections({})
    setMode("returning")
  }

  async function handleReturn() {
    if (!sessionIdRef.current) return
    setSubmitting(true)

    const supabase = createClient()

    const { error } = await supabase.rpc("return_items", {
      p_session_id: sessionIdRef.current,
      p_user_id: userId,
    })

    setSubmitting(false)

    if (error) {
      const { toast } = await import("sonner")
      toast.error("Error al devolver artículos")
      return
    }

    sessionIdRef.current = null
    setWithdrawnItems([])

    if (cabinet) {
      const { data } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("cabinet_id", cabinet.id)
        .order("name")
      setItems(data ?? [])
    }

    setMode("browse")
  }

  return {
    mode,
    items,
    withdrawnItems,
    selections,
    totalSelected,
    submitting,
    setQty,
    handleWithdraw,
    handleReturn,
  }
}
