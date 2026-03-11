import { CabinetGrid } from "@/components/cabinets/cabinet-grid"
import { AppNav } from "@/components/layout/app-nav"
import { getCabinetsWithCounts } from "@/lib/data/cabinets/get-cabinets"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CabinetsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [cabinets, profileRes] = await Promise.all([
    getCabinetsWithCounts(supabase),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav userEmail={user.email} userName={profileRes.data?.full_name} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Gabinetes
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {cabinets.length === 0
              ? "No hay gabinetes registrados aún."
              : `${cabinets.length} gabinete${cabinets.length !== 1 ? "s" : ""} en el sistema`}
          </p>
        </div>

        <CabinetGrid initialCabinets={cabinets} userId={user.id} />
      </main>
    </div>
  )
}
