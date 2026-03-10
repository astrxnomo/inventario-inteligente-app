"use client"

import { useCabinets } from "@/hooks/use-cabinets"
import type { Cabinet } from "@/lib/types/cabinet"
import { cn } from "@/lib/utils"
import { Wifi, WifiOff } from "lucide-react"
import { useState } from "react"
import { CabinetCard } from "./cabinet-card"
import { CabinetDetail } from "./cabinet-detail"

interface CabinetGridProps {
  initialCabinets: Cabinet[]
  userId: string
}

export function CabinetGrid({ initialCabinets, userId }: CabinetGridProps) {
  const { cabinets, isConnected } = useCabinets(initialCabinets)
  const [selected, setSelected] = useState<Cabinet | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleCardClick(cabinet: Cabinet) {
    setSelected(cabinet)
    setDrawerOpen(true)
  }

  if (cabinets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center mb-4">
          <span className="text-3xl">🗄️</span>
        </div>
        <p className="text-gray-500 text-sm">No hay gabinetes registrados.</p>
        <p className="text-gray-400 text-xs mt-1">Pide a un administrador que agregue gabinetes.</p>
      </div>
    )
  }

  return (
    <>
      {/* Connection indicator */}
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border shadow-sm transition-all duration-500",
          isConnected
            ? "bg-primary/5 text-primary border-primary/20"
            : "bg-red-50 text-red-700 border-red-200"
        )}
      >
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? "En vivo" : "Sin conexión"}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cabinets.map((cabinet) => (
          <CabinetCard key={cabinet.id} cabinet={cabinet} onClick={handleCardClick} />
        ))}
      </div>

      <CabinetDetail
        cabinet={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        userId={userId}
      />
    </>
  )
}
