import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { requireAdmin } from "@/lib/utils/admin"
import { changeAdminEmailSchema } from "@/lib/validations/admin"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// PUT - Alterar email do admin
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin()

    const body = await request.json()
    const validatedData = changeAdminEmailSchema.parse(body)

    // Verificar se o novo email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.newEmail },
    })

    if (existingUser && existingUser.id !== session.id) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      )
    }

    // Buscar usuário atual e verificar senha
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { password: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 400 }
      )
    }

    // Atualizar email
    await prisma.user.update({
      where: { id: session.id },
      data: { email: validatedData.newEmail },
    })

    logger.info("Email do admin alterado", { userId: session.id, newEmail: validatedData.newEmail })

    return NextResponse.json({ message: "Email alterado com sucesso" })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao alterar email do admin", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}




