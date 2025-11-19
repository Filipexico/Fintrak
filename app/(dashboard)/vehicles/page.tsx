import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { VehiclesList } from "@/components/vehicles/VehiclesList"

export default async function VehiclesPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-6">
      <VehiclesList />
    </div>
  )
}



