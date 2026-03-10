"use client"

import { Button } from "@/components/ui/button"
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
import { signOut } from "@/lib/actions/auth"
import { createClient } from "@/lib/supabase/client"
import { LogOut, UserRound } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface UserMenuProps {
  userEmail: string | undefined
  userName?: string | null
}

export function UserMenu({ userEmail, userName: initialName }: UserMenuProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [name, setName] = useState(initialName ?? "")
  const [saving, setSaving] = useState(false)

  const displayName = name.trim() || initialName

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (userEmail?.[0] ?? "U").toUpperCase()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() || null })
      .eq("id", user.id)

    setSaving(false)

    if (error) {
      toast.error("No se pudo guardar el perfil")
      return
    }

    toast.success("Perfil actualizado")
    setProfileOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-white text-xs font-semibold select-none">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[160px] truncate">
              {displayName ?? userEmail}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="font-normal py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-white text-sm font-semibold">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                {displayName && (
                  <span className="text-sm font-medium text-gray-900 truncate">{displayName}</span>
                )}
                {userEmail && (
                  <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onSelect={() => setProfileOpen(true)}
          >
            <UserRound className="h-4 w-4 text-muted-foreground" />
            Actualizar perfil
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
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

          <form onSubmit={handleSave} className="space-y-4 pt-1">
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
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProfileOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
