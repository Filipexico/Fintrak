import { requireAdmin } from "@/lib/utils/admin"
import { BusinessDashboard } from "@/components/admin/BusinessDashboard"

export default async function AdminPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard de Negócios</h1>
        <p className="mt-2 text-muted-foreground">
          Visão geral financeira e métricas do sistema
        </p>
      </div>
      <BusinessDashboard />
    </div>
  )
}
