"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export function ResetPasswordForm() {
  const [values, setValues] = useState<ResetPasswordInput>({ email: "" })
  const [errors, setErrors] = useState<Partial<ResetPasswordInput>>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = resetPasswordSchema.safeParse(values)
    if (!result.success) {
      setErrors({ email: result.error.issues[0].message })
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password/update`,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setSent(true)
    toast.success("Revisa tu email para continuar.")
  }

  if (sent) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Revisa tu email</CardTitle>
          <CardDescription>
            Enviamos un link a{" "}
            <span className="font-medium text-foreground">{values.email}</span>.
            Úsalo para crear una nueva contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => { setSent(false); setValues({ email: "" }) }}>
            Usar otro email
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>Te enviaremos un link para restablecer tu contraseña.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={values.email}
              onChange={(e) => setValues({ email: e.target.value })}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando…" : "Enviar email de recuperación"}
          </Button>
          <p className="text-center text-sm">
            <Link href="/login" className="text-muted-foreground underline-offset-4 hover:underline">
              ← Volver al login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
