import { requireAdmin } from "@/lib/utils/admin"
import { AdminSettings } from "@/components/admin/AdminSettings"

export default async function AdminSettingsPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie suas configurações de conta e segurança
        </p>
      </div>
      <AdminSettings />
    </div>
  )
}



