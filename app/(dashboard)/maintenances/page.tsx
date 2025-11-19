import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MaintenancesList } from "@/components/maintenances/MaintenancesList"

export default async function MaintenancesPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-6">
      <MaintenancesList />
    </div>
  )
}



