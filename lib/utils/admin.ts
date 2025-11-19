import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Verifica se o usuário é admin
 * Redireciona se não for admin
 * Retorna o usuário autenticado
 */
export async function requireAdmin() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  }
}

