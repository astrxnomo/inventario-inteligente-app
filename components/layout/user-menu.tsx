"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AuthState } from "@/lib/actions/auth/shared"
import { signOut } from "@/lib/actions/auth/sign-out"
import { updateProfileAction } from "@/lib/actions/auth/update-profile"
import { LogOut, UserRound } from "lucide-react"
import { useActionState, useState } from "react"
import { SubmitButton } from "../ui/submit-button"

interface UserMenuProps {
  userEmail: string | undefined
  userName?: string | null
}

const initialState: AuthState = {}

export function UserMenu({ userEmail, userName: initialName }: UserMenuProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [state, formAction] = useActionState(updateProfileAction, initialState)

  const displayName = initialName?.trim() || undefined

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (userEmail?.[0] ?? "U").toUpperCase()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-zinc-300">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-xs font-semibold text-white select-none">
              {initials}
            </div>
            <span className="hidden max-w-[160px] truncate text-sm font-medium text-gray-700 sm:block">
              {displayName ?? userEmail}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="py-2.5 font-normal">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-sm font-semibold text-white">
                {initials}
              </div>
              <div className="flex min-w-0 flex-col">
                {displayName && (
                  <span className="truncate text-sm font-medium text-gray-900">
                    {displayName}
                  </span>
                )}
                {userEmail && (
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2"
            onSelect={() => setProfileOpen(true)}
          >
            <UserRound className="h-4 w-4 text-muted-foreground" />
            Actualizar perfil
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
            onSelect={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Actualizar perfil</DialogTitle>
            <DialogDescription>
              Cambia tu nombre visible. El email no se puede modificar.
            </DialogDescription>
          </DialogHeader>

          <form action={formAction} className="space-y-4 pt-1">
            {state.success && (
              <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                Perfil actualizado correctamente.
              </p>
            )}
            {state.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={userEmail ?? ""}
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Nombre completo</Label>
              <Input
                id="profile-name"
                name="name"
                placeholder="Tu nombre"
                defaultValue={initialName ?? ""}
                autoFocus
              />
            </div>
            <SubmitButton pendingText="Guardando…">Guardar</SubmitButton>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
