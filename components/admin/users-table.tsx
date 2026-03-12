"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { authorizeUser } from "@/lib/actions/admin/authorize-user"
import { changeUserRole } from "@/lib/actions/admin/change-role"
import type { AdminUser } from "@/lib/data/admin/get-users"
import { CheckCircle, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

const ROLE_LABELS: Record<string, string> = {
  pending: "Pendiente",
  user: "Usuario",
  admin: "Administrador",
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

interface UsersTableProps {
  users: AdminUser[]
  callerRole: string
}

export function UsersTable({ users, callerRole }: UsersTableProps) {
  const isRoot = callerRole === "root"
  const [pending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  function handleAuthorize(userId: string) {
    setLoadingId(userId)
    startTransition(async () => {
      const result = await authorizeUser(userId)
      setLoadingId(null)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Usuario autorizado correctamente")
      }
    })
  }

  function handleChangeRole(userId: string, newRole: string) {
    setLoadingId(userId)
    startTransition(async () => {
      const result = await changeUserRole(userId, newRole)
      setLoadingId(null)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Rol actualizado correctamente")
      }
    })
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Registrado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                No hay usuarios registrados.
              </TableCell>
            </TableRow>
          )}
          {users.map((user) => {
            const isLoading = loadingId === user.id && pending
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.full_name || (
                    <span className="text-muted-foreground italic">
                      Sin nombre
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant={ROLE_BADGE_VARIANT[user.role] ?? "outline"}>
                    {ROLE_LABELS[user.role] ?? user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {user.role === "pending" && (
                      <Button
                        size="sm"
                        disabled={isLoading}
                        onClick={() => handleAuthorize(user.id)}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-1 h-3.5 w-3.5" />
                        )}
                        Autorizar
                      </Button>
                    )}
                    {isRoot && user.role !== "root" && (
                      <Select
                        defaultValue={user.role}
                        disabled={isLoading}
                        onValueChange={(val) => handleChangeRole(user.id, val)}
                      >
                        <SelectTrigger className="h-8 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
