import { RegisterForm } from "@/components/auth/register-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect("/")

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <RegisterForm />
    </main>
  )
}
