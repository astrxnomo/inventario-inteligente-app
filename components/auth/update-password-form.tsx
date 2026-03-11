"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  updatePasswordAction,
  type AuthState,
} from "@/lib/actions/auth/update-password"
import { useActionState } from "react"
import { SubmitButton } from "../ui/submit-button"

const initialState: AuthState = {}

export function UpdatePasswordForm() {
  const [state, action] = useActionState(updatePasswordAction, initialState)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Nueva contraseña</CardTitle>
        <CardDescription>
          Elige una contraseña segura para tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {state.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              autoFocus
            />
            {state.fieldErrors?.password && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar contraseña</Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {state.fieldErrors?.confirm && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.confirm}
              </p>
            )}
          </div>

          <SubmitButton pendingText="Actualizando…">
            Actualizar contraseña
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  )
}
