import type { WithdrawnItem } from "@/lib/types/inventory"
import { CheckCircle2 } from "lucide-react"

interface ReturnListProps {
  withdrawnItems: WithdrawnItem[]
}

export function ReturnList({ withdrawnItems }: ReturnListProps) {
  if (withdrawnItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-primary/20 mb-2" />
        <p className="text-gray-400 text-sm">No hay artículos pendientes</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {withdrawnItems.map((item) => (
        <li
          key={item.session_item_id || item.item_id}
          className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-4 py-3"
        >
          <span className="text-sm text-gray-800 truncate">
            {item.name}
            {item.unit && (
              <span className="ml-1.5 text-[11px] text-gray-400">{item.unit}</span>
            )}
          </span>
          <div className="flex items-center gap-1 shrink-0 ml-3">
            <span className="text-sm font-semibold tabular-nums text-amber-700">
              {item.quantity}
            </span>
            <span className="text-[11px] text-amber-500">
              retirado{item.quantity !== 1 ? "s" : ""}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
