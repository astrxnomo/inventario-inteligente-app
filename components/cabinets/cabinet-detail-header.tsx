import { Badge } from "@/components/ui/badge"
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { STATUS_CONFIG } from "@/lib/constants/cabinet-status"
import type { Cabinet } from "@/lib/types/cabinets"
import { cn } from "@/lib/utils"
import { Archive, Users } from "lucide-react"

interface CabinetDetailHeaderProps {
  cabinet: Cabinet
  isReturning: boolean
}

export function CabinetDetailHeader({
  cabinet,
  isReturning,
}: CabinetDetailHeaderProps) {
  return (
    <DrawerHeader className="shrink-0 border-b border-gray-100 px-5 pt-4 pb-3 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <DrawerTitle className="text-base leading-tight font-semibold text-gray-900">
            {cabinet.name}
          </DrawerTitle>
          <DrawerDescription className="mt-0.5 text-sm text-gray-500">
            {isReturning
              ? "Sesión abierta — confirma la devolución"
              : (cabinet.location ?? "Selecciona los artículos a retirar")}
          </DrawerDescription>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "mt-0.5 shrink-0 border text-[11px] font-medium",
            STATUS_CONFIG[cabinet.status].badgeClass,
          )}
        >
          {STATUS_CONFIG[cabinet.status].label}
        </Badge>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Archive className="h-3.5 w-3.5" />
          <span>{cabinet._count.inventory_items} artículos</span>
        </div>
        {cabinet._count.active_sessions > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600">
            <Users className="h-3.5 w-3.5" />
            <span>
              {cabinet._count.active_sessions} sesión
              {cabinet._count.active_sessions !== 1 ? "es activas" : " activa"}
            </span>
          </div>
        )}
      </div>
    </DrawerHeader>
  )
}
