import { AdminSubNav } from "@/components/admin/admin-sub-nav"
import { LogsView } from "@/components/admin/logs-view"
import { AppNav } from "@/components/layout/app-nav"
import { RefreshButton } from "@/components/ui/refresh-button"
import { getAccessLogs, getSessionsWithItems } from "@/lib/data/admin/get-logs"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLogsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "root"].includes(profile.role)) {
    redirect("/cabinets")
  }

  const [sessions, accessLogs] = await Promise.all([
    getSessionsWithItems(supabase),
    getAccessLogs(supabase),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav
        userEmail={user.email}
        userRole={profile.role}
        userName={profile.full_name}
      />

      <AdminSubNav active="logs" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Actividad
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Últimas 100 sesiones · ordenadas por fecha descendente
            </p>
          </div>
          <RefreshButton />
        </div>

        <LogsView sessions={sessions} accessLogs={accessLogs} />
      </main>
    </div>
  )
}
