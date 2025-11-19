import { requireAdmin } from "@/lib/utils/admin"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { UserDashboardView } from "@/components/admin/UserDashboardView"

export default async function AdminUserViewPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAdmin()

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      currency: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard do Usuário</h1>
        <p className="mt-2 text-muted-foreground">
          {user.name} ({user.email})
        </p>
      </div>
      <UserDashboardView userId={params.id} currency={user.currency} />
    </div>
  )
}



