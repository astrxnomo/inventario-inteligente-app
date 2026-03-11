"use client"

import { subscribeCabinetsGrid } from "@/lib/realtime/cabinets"
import type { Cabinet, CabinetRow } from "@/lib/types/cabinets"
import { useEffect, useState } from "react"

export function useCabinets(initialCabinets: Cabinet[]) {
  const [cabinets, setCabinets] = useState<Cabinet[]>(initialCabinets)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeCabinetsGrid({
      onCabinetInsert(row: CabinetRow) {
        setCabinets((prev) => [
          ...prev,
          { ...row, _count: { inventory_items: 0, active_sessions: 0 } },
        ])
      },

      onCabinetUpdate(id: string, changes: Partial<CabinetRow>) {
        setCabinets((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...changes } : c)),
        )
      },

      onCabinetDelete(id: string) {
        setCabinets((prev) => prev.filter((c) => c.id !== id))
      },

      onSessionChanged(cabinetId: string, delta: 1 | -1) {
        setCabinets((prev) =>
          prev.map((c) => {
            if (c.id !== cabinetId) return c
            const activeSessions = Math.max(0, c._count.active_sessions + delta)
            return {
              ...c,
              status:
                c.status !== "locked"
                  ? activeSessions > 0
                    ? "in_use"
                    : "available"
                  : "locked",
              _count: { ...c._count, active_sessions: activeSessions },
            }
          }),
        )
      },

      onInventoryInsert(cabinetId: string) {
        setCabinets((prev) =>
          prev.map((c) =>
            c.id === cabinetId
              ? {
                  ...c,
                  _count: {
                    ...c._count,
                    inventory_items: c._count.inventory_items + 1,
                  },
                }
              : c,
          ),
        )
      },

      onInventoryDelete(cabinetId: string) {
        setCabinets((prev) =>
          prev.map((c) =>
            c.id === cabinetId
              ? {
                  ...c,
                  _count: {
                    ...c._count,
                    inventory_items: Math.max(0, c._count.inventory_items - 1),
                  },
                }
              : c,
          ),
        )
      },

      onConnected(connected: boolean) {
        setIsConnected(connected)
      },
    })

    return unsubscribe
  }, [])

  return { cabinets, isConnected }
}
