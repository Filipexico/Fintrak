import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { updateExpenseSchema } from "@/lib/validations/expense"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter despesa específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    const expense = await prisma.expense.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
    })

    if (!expense) {
      return NextResponse.json(
        { error: "Despesa não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(expense)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter despesa", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar despesa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()
    const body = await request.json()
    const validatedData = updateExpenseSchema.parse(body)

    // Verificar se a despesa existe e pertence ao usuário
    const existing = await prisma.expense.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Despesa não encontrada" },
        { status: 404 }
      )
    }

    // Filtrar apenas campos permitidos (prevenir mass assignment)
    const { category, amount, currency, date, description } = validatedData
    const updateData = {
      ...(category !== undefined && { category }),
      ...(amount !== undefined && { amount }),
      ...(currency !== undefined && { currency }),
      ...(date && { date: new Date(date) }),
      ...(description !== undefined && { description }),
      // userId NUNCA é incluído - prevenção de mass assignment
    }

    // Incluir userId no where para prevenir race conditions
    const expense = await prisma.expense.update({
      where: { 
        id: params.id,
        userId, // Garante atomicidade e previne race conditions
      },
      data: updateData,
    })

    return NextResponse.json(expense)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar despesa", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar despesa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar se a despesa existe e pertence ao usuário
    const existing = await prisma.expense.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Despesa não encontrada" },
        { status: 404 }
      )
    }

    // Incluir userId no where para garantir que apenas o dono pode deletar
    await prisma.expense.delete({
      where: { 
        id: params.id,
        userId, // Garante atomicidade
      },
    })

    return NextResponse.json({ message: "Despesa deletada com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar despesa", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

