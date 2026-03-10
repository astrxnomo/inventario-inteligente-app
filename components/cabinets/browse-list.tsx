import type { InventoryItem, Selections } from "@/lib/types/inventory"
import { cn } from "@/lib/utils"
import { AlertTriangle, Minus, Package, Plus } from "lucide-react"

interface BrowseListProps {
  items: InventoryItem[]
  selections: Selections
  setQty: (itemId: string, qty: number) => void
}

export function BrowseList({ items, selections, setQty }: BrowseListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Package className="h-8 w-8 text-gray-200 mb-2" />
        <p className="text-gray-400 text-sm">Sin artículos registrados</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const isLow = item.quantity <= item.min_quantity
        const qty = selections[item.id] ?? 0
        const outOfStock = item.quantity === 0

        return (
          <li
            key={item.id}
            className={cn(
              "flex items-center justify-between rounded-lg border px-4 py-3 transition-colors",
              outOfStock
                ? "border-gray-100 bg-gray-50 opacity-50"
                : qty > 0
                ? "border-primary/20 bg-primary/5"
                : "border-gray-100 bg-gray-50"
            )}
          >
            {/* Left: name + stock info */}
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-1.5 min-w-0">
                {isLow && !outOfStock && (
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                )}
                <span className="text-sm text-gray-800 truncate">{item.name}</span>
                {item.unit && (
                  <span className="text-[11px] text-gray-400 shrink-0">{item.unit}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] tabular-nums",
                  isLow ? "text-amber-600" : "text-gray-400"
                )}
              >
                {item.quantity} disponible{item.quantity !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Right: stepper */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                aria-label="Reducir cantidad"
                disabled={outOfStock || qty === 0}
                onClick={() => setQty(item.id, qty - 1)}
                className={cn(
                  "h-7 w-7 rounded-full border flex items-center justify-center transition-colors",
                  qty > 0
                    ? "border-primary/30 bg-white text-primary hover:bg-primary/10"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                )}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="w-5 text-center text-sm font-semibold tabular-nums text-gray-900">
                {qty}
              </span>

              <button
                type="button"
                aria-label="Aumentar cantidad"
                disabled={outOfStock || qty >= item.quantity}
                onClick={() => setQty(item.id, qty + 1)}
                className={cn(
                  "h-7 w-7 rounded-full border flex items-center justify-center transition-colors",
                  qty < item.quantity && !outOfStock
                    ? "border-primary/30 bg-white text-primary hover:bg-primary/10"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                )}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
