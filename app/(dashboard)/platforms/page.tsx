import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PlatformsList } from "@/components/platforms/PlatformsList"

export default async function PlatformsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plataformas</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie suas plataformas de entrega
          </p>
        </div>
      </div>
      <PlatformsList />
    </div>
  )
}




