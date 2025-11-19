import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const session = await auth()

  // Verificar se existe admin no sistema
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  })

  // Se não existe admin, redirecionar para setup
  if (adminCount === 0) {
    redirect("/setup")
  }

  if (!session) {
    // Redirect to home page
    redirect(`/home`)
  }

  // Redirecionar baseado no role
  if (session.user?.role === "ADMIN") {
    redirect("/admin")
  }

  redirect("/dashboard")
}
