import { AdminSubNav } from "@/components/admin/admin-sub-nav"
import { UsersTable } from "@/components/admin/users-table"
import { AppNav } from "@/components/layout/app-nav"
import { RefreshButton } from "@/components/ui/refresh-button"
import { getAdminUserList } from "@/lib/data/admin/get-users"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminUsersPage() {
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

  const users = await getAdminUserList(supabase)
  const pending = users.filter((u) => u.role === "pending").length

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav
        userEmail={user.email}
        userRole={profile.role}
        userName={profile.full_name}
      />

      <AdminSubNav active="users" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Gestión de usuarios
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {users.length} usuario{users.length !== 1 ? "s" : ""} registrado
              {users.length !== 1 ? "s" : ""}
              {pending > 0 && (
                <span className="ml-2 font-medium text-amber-600">
                  · {pending} pendiente{pending !== 1 ? "s" : ""} de
                  autorización
                </span>
              )}
            </p>
          </div>
          <RefreshButton />
        </div>

        <UsersTable users={users} callerRole={profile.role} />
      </main>
    </div>
  )
}
