import { LayoutGrid, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { UserMenu } from "./user-menu"

interface AppNavProps {
  userEmail?: string
  userRole?: string
  userName?: string | null
}

export function AppNav({ userEmail, userRole, userName }: AppNavProps) {
  const isAdmin = userRole === "admin" || userRole === "root"

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/cabinets" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
              <LayoutGrid className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-gray-900">
              Inventario Inteligente
            </span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/users"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ShieldCheck className="h-4 w-4" />
              Panel Admin
            </Link>
          )}
        </div>

        <UserMenu userEmail={userEmail} userRole={userRole} userName={userName} />
      </div>
    </header>
  )
}
