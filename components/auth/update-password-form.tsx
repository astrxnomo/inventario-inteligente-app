"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { updatePasswordSchema, type UpdatePasswordInput } from "@/lib/validations/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Errors = Partial<Record<keyof UpdatePasswordInput, string>>

export function UpdatePasswordForm() {
  const router = useRouter()
  const [values, setValues] = useState<UpdatePasswordInput>({ password: "", confirm: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  function set(field: keyof UpdatePasswordInput) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = updatePasswordSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Errors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof UpdatePasswordInput
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: values.password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("¡Contraseña actualizada!")
    router.push("/")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Nueva contraseña</CardTitle>
        <CardDescription>Elige una contraseña segura para tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={set("password")}
              disabled={loading}
              autoComplete="new-password"
              autoFocus
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar contraseña</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={values.confirm}
              onChange={set("confirm")}
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Actualizando…" : "Actualizar contraseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
