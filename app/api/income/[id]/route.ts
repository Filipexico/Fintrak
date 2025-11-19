import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { updateIncomeSchema } from "@/lib/validations/income"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter receita específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    const income = await prisma.income.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
      include: {
        platform: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!income) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(income)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter receita", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar receita
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()
    const body = await request.json()
    const validatedData = updateIncomeSchema.parse(body)

    // Verificar se a receita existe e pertence ao usuário
    const existing = await prisma.income.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 }
      )
    }

    // Se platformId foi fornecido, verificar se pertence ao usuário
    if (validatedData.platformId) {
      const platform = await prisma.platform.findFirst({
        where: {
          id: validatedData.platformId,
          userId, // Isolamento multi-tenant
        },
      })

      if (!platform) {
        return NextResponse.json(
          { error: "Plataforma não encontrada" },
          { status: 404 }
        )
      }
    }

    // Filtrar apenas campos permitidos (prevenir mass assignment)
    const { platformId, amount, currency, date, description } = validatedData
    const updateData = {
      ...(platformId !== undefined && { platformId: platformId || null }),
      ...(amount !== undefined && { amount }),
      ...(currency !== undefined && { currency }),
      ...(date && { date: new Date(date) }),
      ...(description !== undefined && { description }),
      // userId NUNCA é incluído - prevenção de mass assignment
    }

    // Incluir userId no where para prevenir race conditions
    const income = await prisma.income.update({
      where: { 
        id: params.id,
        userId, // Garante atomicidade e previne race conditions
      },
      data: updateData,
      include: {
        platform: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(income)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar receita", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar receita
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar se a receita existe e pertence ao usuário
    const existing = await prisma.income.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 }
      )
    }

    // Incluir userId no where para garantir que apenas o dono pode deletar
    await prisma.income.delete({
      where: { 
        id: params.id,
        userId, // Garante atomicidade
      },
    })

    return NextResponse.json({ message: "Receita deletada com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar receita", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

