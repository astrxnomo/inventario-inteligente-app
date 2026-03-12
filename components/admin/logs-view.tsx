"use client"

import { Badge } from "@/components/ui/badge"
import type { AccessLogEntry, SessionWithItems } from "@/lib/types/admin"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Clock, Package } from "lucide-react"
import { useState } from "react"

function initials(name: string | null): string {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function fmtTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-MX", {
    hour: "2-digit", minute: "2-digit",
  })
}

function fmtFull(dateStr: string): string {
  return new Date(dateStr).toLocaleString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function duration(open: string, close: string | null): string | null {
  if (!close) return null
  const ms = new Date(close).getTime() - new Date(open).getTime()
  const mins = Math.round(ms / 60000)
  if (mins < 1) return "< 1 min"
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h ${mins % 60}min`
}

const ACCESS_ACTION_LABELS: Record<string, string> = {
  open_requested: "Solicitud",
  open_granted: "Apertura",
  open_denied: "Denegado",
  closed: "Cierre",
}

const ACCESS_ACTION_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  open_requested: "outline",
  open_granted: "default",
  open_denied: "destructive",
  closed: "secondary",
}

function SessionCard({ session }: { session: SessionWithItems }) {
  const isActive = !session.closed_at
  const [expanded, setExpanded] = useState(isActive)

  const dur = duration(session.opened_at, session.closed_at)
  const withdrawn = session.items.filter((i) => i.action === "withdrawn")

  return (
    <div className={cn(
      "overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-sm",
      isActive && "border-primary/40 ring-1 ring-primary/10",
    )}>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50/80"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {initials(session.user_name)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0">
            <span className="text-sm font-semibold text-gray-900">{session.user_name ?? "—"}</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-600">{session.cabinet_name ?? "—"}</span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-muted-foreground">
            <span>{fmtDate(session.opened_at)} · {fmtTime(session.opened_at)}</span>
            {dur && (
              <span className="flex items-center gap-0.5">
                <Clock className="size-3" />{dur}
              </span>
            )}
            {withdrawn.length > 0 && (
              <span className="flex items-center gap-0.5">
                <Package className="size-3" />
                {withdrawn.length} artículo{withdrawn.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
            {isActive ? "Activa" : "Cerrada"}
          </Badge>
          {expanded ? <ChevronDown className="size-4 text-gray-400" /> : <ChevronRight className="size-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3">
          {session.items.length === 0 ? (
            <p className="text-xs text-muted-foreground">Sin artículos registrados en esta sesión.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="pb-1.5 text-left font-medium">Artículo</th>
                  <th className="pb-1.5 text-center font-medium">Cant.</th>
                  <th className="pb-1.5 text-center font-medium">Acción</th>
                  <th className="pb-1.5 text-right font-medium">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {session.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-1.5 font-medium text-gray-800">{item.item_name ?? "Artículo"}</td>
                    <td className="py-1.5 text-center tabular-nums text-gray-600">{item.quantity}</td>
                    <td className="py-1.5 text-center">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        item.action === "withdrawn"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700",
                      )}>
                        {item.action === "withdrawn" ? "Retirado" : "Devuelto"}
                      </span>
                    </td>
                    <td className="py-1.5 text-right tabular-nums text-muted-foreground">{fmtTime(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {session.closed_at && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Cerrada el {fmtFull(session.closed_at)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface LogsViewProps {
  sessions: SessionWithItems[]
  accessLogs: AccessLogEntry[]
}

type Tab = "sesiones" | "accesos"

export function LogsView({ sessions, accessLogs }: LogsViewProps) {
  const [tab, setTab] = useState<Tab>("sesiones")

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "sesiones", label: "Sesiones", count: sessions.length },
    { id: "accesos", label: "Accesos", count: accessLogs.length },
  ]

  return (
    <div className="space-y-4">
      <div className="flex w-fit gap-1 rounded-lg border border-gray-200 bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {t.label}
            <span className={cn(
              "rounded-full px-1.5 py-0 text-xs",
              tab === t.id ? "bg-white/20" : "bg-gray-100 text-gray-500",
            )}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "sesiones" && (
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-muted-foreground">
              Sin sesiones registradas.
            </div>
          ) : (
            sessions.map((s) => <SessionCard key={s.id} session={s} />)
          )}
        </div>
      )}

      {tab === "accesos" && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Fecha</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Gabinete</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Usuario</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accessLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">Sin registros.</td>
                </tr>
              )}
              {accessLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-muted-foreground">{fmtFull(log.created_at)}</td>
                  <td className="px-4 py-3 font-medium">{log.cabinet_name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.user_name ?? "Sistema"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ACCESS_ACTION_VARIANT[log.action] ?? "outline"}>
                      {ACCESS_ACTION_LABELS[log.action] ?? log.action}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
