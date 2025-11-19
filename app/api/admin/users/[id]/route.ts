import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        country: true,
        currency: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            incomes: true,
            expenses: true,
            platforms: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter usuário", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar usuário (ativar/desativar, mudar role)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()

    const body = await request.json()
    const { isActive, role } = body

    // Não permitir desativar a si mesmo
    if (params.id === session.id && isActive === false) {
      return NextResponse.json(
        { error: "Você não pode desativar sua própria conta" },
        { status: 400 }
      )
    }

    // Filtrar apenas campos permitidos (prevenir mass assignment)
    const updateData: { isActive?: boolean; role?: "USER" | "ADMIN" } = {}
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive
    }
    if (role && (role === "USER" || role === "ADMIN")) {
      updateData.role = role
    }
    // Não permitir alteração de password, email, etc. via esta rota

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        role: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao atualizar usuário", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// DELETE - Deletar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()

    // Não permitir deletar a si mesmo
    if (params.id === session.id) {
      return NextResponse.json(
        { error: "Você não pode deletar sua própria conta" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Usuário deletado com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar usuário", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

