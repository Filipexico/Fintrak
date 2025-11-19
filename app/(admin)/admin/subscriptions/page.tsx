import { requireAdmin } from "@/lib/utils/admin"
import { SubscriptionsList } from "@/components/admin/SubscriptionsList"

export default async function AdminSubscriptionsPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Assinaturas</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie todas as assinaturas do sistema
        </p>
      </div>
      <SubscriptionsList />
    </div>
  )
}



