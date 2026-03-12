"use client"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/actions/auth/sign-out"
import { LogOut, User } from "lucide-react"
import { Button } from "../ui/button"

const ROLE_LABELS: Record<string, string> = {
  pending: "Pendiente",
  user: "Usuario",
  admin: "Admin",
  root: "Root",
}

const ROLE_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  user: "secondary",
  admin: "default",
  root: "destructive",
}

interface UserMenuProps {
  userEmail?: string
  userRole?: string
  userName?: string | null
}

export function UserMenu({ userEmail, userRole, userName }: UserMenuProps) {
  const displayName = userName || userEmail?.split("@")[0] || "Usuario"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          <span>{displayName}</span>
          {userRole && userRole !== "user" && (
            <Badge
              variant={ROLE_BADGE_VARIANT[userRole] ?? "outline"}
              className="ml-0.5 px-1.5 py-0 text-[10px]"
            >
              {ROLE_LABELS[userRole] ?? userRole}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="py-2.5 font-normal">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              {userName && (
                <span className="truncate text-sm font-medium text-foreground">
                  {userName}
                </span>
              )}
              {userEmail && (
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </span>
              )}
              {userRole && (
                <Badge
                  variant={ROLE_BADGE_VARIANT[userRole] ?? "outline"}
                  className="mt-0.5 w-fit px-1.5 py-0 text-[10px]"
                >
                  {ROLE_LABELS[userRole] ?? userRole}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-destructive hover:bg-destructive/5 focus:text-destructive"
          onSelect={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
