import { requireAdmin } from "@/lib/utils/admin"
import { PartnersList } from "@/components/admin/PartnersList"

export default async function AdminPartnersPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Parceiros / Usuários</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie todos os usuários cadastrados no sistema
        </p>
      </div>
      <PartnersList />
    </div>
  )
}



