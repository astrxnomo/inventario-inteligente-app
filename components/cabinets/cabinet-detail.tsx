"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCabinetDetail } from "@/hooks/use-cabinet-detail"
import type { Cabinet } from "@/lib/types/cabinet"
import { cn } from "@/lib/utils"
import { ClipboardList, Loader2, Lock, RotateCcw, Unlock } from "lucide-react"
import { BrowseList } from "./browse-list"
import { CabinetDetailHeader } from "./cabinet-detail-header"
import { ReturnList } from "./return-list"

interface CabinetDetailProps {
  cabinet: Cabinet | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function CabinetDetail({
  cabinet,
  open,
  onOpenChange,
  userId,
}: CabinetDetailProps) {
  const {
    mode,
    items,
    withdrawnItems,
    selections,
    totalSelected,
    submitting,
    setQty,
    handleWithdraw,
    handleReturn,
  } = useCabinetDetail(cabinet, userId, open)

  const isLoading = mode === "loading"
  const isReturning = mode === "returning"

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col max-h-[92vh]">
        {cabinet && (
          <>
            <CabinetDetailHeader cabinet={cabinet} isReturning={isReturning} />

            {/* Scrollable content area */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="flex items-center gap-2 px-5 py-2.5 shrink-0">
                {isReturning ? (
                  <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <ClipboardList className="h-3.5 w-3.5 text-gray-400" />
                )}
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {isReturning ? "Artículos retirados" : "Inventario disponible"}
                </span>
              </div>
              <Separator className="bg-gray-100 shrink-0" />

              <ScrollArea className="flex-1 px-5 py-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                  </div>
                ) : isReturning ? (
                  <ReturnList withdrawnItems={withdrawnItems} />
                ) : (
                  <BrowseList items={items} selections={selections} setQty={setQty} />
                )}
              </ScrollArea>
            </div>

            {/* Footer actions */}
            <DrawerFooter className="pt-2 pb-6 px-5 border-t border-gray-100 shrink-0">
              {isReturning ? (
                <Button
                  size="lg"
                  className="w-full gap-2 font-semibold text-base h-12 bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={submitting}
                  onClick={handleReturn}
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <RotateCcw className="h-5 w-5" />
                  )}
                  Devolver todo y cerrar sesión
                </Button>
              ) : cabinet.status === "locked" ? (
                <Button
                  size="lg"
                  className="w-full gap-2 font-semibold text-base h-12 opacity-40 cursor-not-allowed"
                  disabled
                >
                  <Lock className="h-5 w-5" />
                  Gabinete bloqueado
                </Button>
              ) : (
                <Button
                  size="lg"
                  className={cn(
                    "w-full gap-2 font-semibold text-base h-12 transition-colors",
                    totalSelected > 0
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                  disabled={totalSelected === 0 || submitting || isLoading}
                  onClick={handleWithdraw}
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Unlock className="h-5 w-5" />
                  )}
                  {totalSelected > 0
                    ? `Solicitar apertura y retirar ${totalSelected} artículo${totalSelected !== 1 ? "s" : ""}`
                    : "Selecciona artículos a retirar"}
                </Button>
              )}
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
