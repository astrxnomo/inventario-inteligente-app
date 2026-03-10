"use client"

import { createClient } from "@/lib/supabase/client"
import type { Cabinet } from "@/lib/types/cabinet"
import { useEffect, useRef, useState } from "react"

export function useCabinets(initialCabinets: Cabinet[]) {
  const [cabinets, setCabinets] = useState<Cabinet[]>(initialCabinets)
  const [isConnected, setIsConnected] = useState(false)
  const cabinetsRef = useRef(cabinets)

  useEffect(() => {
    cabinetsRef.current = cabinets
  }, [cabinets])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("cabinets-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cabinets" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setCabinets((prev) =>
              prev.map((c) =>
                c.id === (payload.new as Cabinet).id
                  ? { ...c, ...(payload.new as Cabinet) }
                  : c,
              ),
            )
          } else if (payload.eventType === "INSERT") {
            setCabinets((prev) => [
              ...prev,
              {
                ...(payload.new as Cabinet),
                _count: { inventory_items: 0, active_sessions: 0 },
              },
            ])
          } else if (payload.eventType === "DELETE") {
            setCabinets((prev) => prev.filter((c) => c.id !== payload.old.id))
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cabinet_sessions" },
        async () => {
          const { data } = await supabase
            .from("cabinet_sessions")
            .select("cabinet_id")
            .is("closed_at", null)

          const sessionCountMap: Record<string, number> = {}
          for (const row of data ?? []) {
            sessionCountMap[row.cabinet_id] =
              (sessionCountMap[row.cabinet_id] ?? 0) + 1
          }

          setCabinets(
            cabinetsRef.current.map((c) => ({
              ...c,
              _count: {
                ...c._count,
                active_sessions: sessionCountMap[c.id] ?? 0,
              },
            })),
          )
        },
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { cabinets, isConnected }
}
