import { requireAdmin } from "@/lib/utils/admin"
import { UsersList } from "@/components/admin/UsersList"

export default async function AdminUsersPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie usuários do sistema
        </p>
      </div>
      <UsersList />
    </div>
  )
}




