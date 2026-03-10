import { Badge } from "@/components/ui/badge"
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { STATUS_CONFIG } from "@/lib/constants/cabinet-status"
import type { Cabinet } from "@/lib/types/cabinet"
import { cn } from "@/lib/utils"
import { Archive, Users } from "lucide-react"

interface CabinetDetailHeaderProps {
  cabinet: Cabinet
  isReturning: boolean
}

export function CabinetDetailHeader({ cabinet, isReturning }: CabinetDetailHeaderProps) {
  return (
    <DrawerHeader className="text-left px-5 pt-4 pb-3 border-b border-gray-100 shrink-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <DrawerTitle className="text-gray-900 text-base font-semibold leading-tight">
            {cabinet.name}
          </DrawerTitle>
          <DrawerDescription className="text-gray-500 text-sm mt-0.5">
            {isReturning
              ? "Sesión abierta — confirma la devolución"
              : cabinet.location ?? "Selecciona los artículos a retirar"}
          </DrawerDescription>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 text-[11px] font-medium border mt-0.5",
            STATUS_CONFIG[cabinet.status].badgeClass
          )}
        >
          {STATUS_CONFIG[cabinet.status].label}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <Archive className="h-3.5 w-3.5" />
          <span>{cabinet._count.inventory_items} artículos</span>
        </div>
        {cabinet._count.active_sessions > 0 && (
          <div className="flex items-center gap-1.5 text-amber-600 text-xs">
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
