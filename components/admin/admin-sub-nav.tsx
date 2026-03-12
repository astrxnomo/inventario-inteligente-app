"use client"

import Link from "next/link"

import { ActivitySquare, Users } from "lucide-react"

const tabs = [
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/logs", label: "Logs de actividad", icon: ActivitySquare },
]

export function AdminSubNav({ active }: { active: "users" | "logs" }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="-mb-px flex gap-1">
          {tabs.map((tab) => {
            const isActive = tab.href.includes(active)
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
