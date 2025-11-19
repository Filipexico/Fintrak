import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { z } from "zod"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
})

// PUT - Atualizar perfil do admin (nome)
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin()

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const updateData: { name?: string } = {}
    if (validatedData.name) {
      updateData.name = validatedData.name
    }

    const user = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    logger.info("Perfil do admin atualizado", { userId: session.id })

    return NextResponse.json({ message: "Perfil atualizado com sucesso", user })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar perfil do admin", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}



