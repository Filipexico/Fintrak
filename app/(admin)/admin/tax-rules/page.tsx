import { requireAdmin } from "@/lib/utils/admin"
import { TaxRulesList } from "@/components/admin/TaxRulesList"

export default async function AdminTaxRulesPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Regras Fiscais</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie as regras fiscais por país
        </p>
      </div>
      <TaxRulesList />
    </div>
  )
}




