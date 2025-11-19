import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { requireAdmin } from "@/lib/utils/admin"
import { changeAdminPasswordSchema } from "@/lib/validations/admin"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// PUT - Alterar senha do admin
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin()

    const body = await request.json()
    const validatedData = changeAdminPasswordSchema.parse(body)

    // Buscar usuário atual
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

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Senha atual incorreta" },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // Atualizar senha
    await prisma.user.update({
      where: { id: session.id },
      data: { password: hashedPassword },
    })

    logger.info("Senha do admin alterada", { userId: session.id })

    return NextResponse.json({ message: "Senha alterada com sucesso" })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao alterar senha do admin", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}



