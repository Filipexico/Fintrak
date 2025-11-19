import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

/**
 * Obtém o ID do usuário autenticado
 * Para uso em Server Components - redireciona para login se não autenticado
 */
export async function getAuthenticatedUserIdInServerComponent(): Promise<string> {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return session.user.id
}

/**
 * Obtém o ID do usuário autenticado
 * Para uso em API Routes - retorna null se não autenticado (não faz redirect)
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return session.user.id
}



