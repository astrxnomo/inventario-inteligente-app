"use client"

import { Badge } from "@/components/ui/badge"
import { STATUS_CONFIG } from "@/lib/constants/cabinet-status"
import type { Cabinet } from "@/lib/types/cabinet"
import { cn } from "@/lib/utils"
import { Archive, Lock, Package, Users } from "lucide-react"

interface CabinetCardProps {
  cabinet: Cabinet
  onClick: (cabinet: Cabinet) => void
}

export function CabinetCard({ cabinet, onClick }: CabinetCardProps) {
  const config = STATUS_CONFIG[cabinet.status]

  return (
    <button
      onClick={() => onClick(cabinet)}
      className={cn(
        "group relative w-full text-left rounded-xl border border-gray-200 bg-white",
        "p-5 transition-all duration-200 cursor-pointer shadow-sm",
        config.cardGlow,
        config.borderClass,
        "hover:-translate-y-0.5",
        cabinet.status === "locked" && "opacity-50"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border",
            cabinet.status === "available" && "border-primary/20 bg-primary/5 text-primary",
            cabinet.status === "in_use" && "border-amber-200 bg-amber-50 text-amber-600",
            cabinet.status === "locked" && "border-red-200 bg-red-50 text-red-600"
          )}
        >
          {cabinet.status === "locked" ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              config.dotClass,
              cabinet.status !== "locked" && "animate-pulse"
            )}
          />
          <Badge
            variant="outline"
            className={cn("text-[11px] font-medium px-2 py-0 h-5 border", config.badgeClass)}
          >
            {config.label}
          </Badge>
        </div>
      </div>

      {/* Cabinet name */}
      <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">
        {cabinet.name}
      </p>
      {cabinet.location && (
        <p className="text-[12px] text-gray-400 mb-4 truncate">{cabinet.location}</p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Package className="h-3.5 w-3.5" />
          <span className="text-[12px]">
            {cabinet._count?.inventory_items ?? 0} artículos
          </span>
        </div>
        {cabinet._count?.active_sessions != null && cabinet._count.active_sessions > 0 && (
          <div className="flex items-center gap-1.5 text-amber-600">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[12px]">{cabinet._count.active_sessions} activo{cabinet._count.active_sessions !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>
    </button>
  )
}
