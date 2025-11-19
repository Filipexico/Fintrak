import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

export default async function ReportsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="mt-2 text-muted-foreground">
          Visualize seus relatórios financeiros detalhados
        </p>
      </div>
      <DashboardContent />
    </div>
  )
}



