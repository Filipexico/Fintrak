import { requireAdmin } from "@/lib/utils/admin"
import { PaymentsList } from "@/components/admin/PaymentsList"

export default async function AdminPaymentsPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pagamentos</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie todos os pagamentos do sistema
        </p>
      </div>
      <PaymentsList />
    </div>
  )
}



