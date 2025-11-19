import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { updatePlanSchema } from "@/lib/validations/plan"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter plano específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const plan = await prisma.plan.findUnique({
      where: { id: params.id },
    })

    if (!plan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(plan)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter plano", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar plano
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = updatePlanSchema.parse(body)

    // Se está atualizando o nome, verificar duplicatas
    if (validatedData.name) {
      const existing = await prisma.plan.findFirst({
        where: {
          name: validatedData.name,
          id: { not: params.id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: "Já existe um plano com este nome" },
          { status: 400 }
        )
      }
    }

    const plan = await prisma.plan.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(plan)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar plano", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar plano
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    // Verificar se há assinaturas usando este plano
    const subscriptionsCount = await prisma.subscription.count({
      where: { planId: params.id },
    })

    if (subscriptionsCount > 0) {
      return NextResponse.json(
        { error: "Não é possível deletar um plano que possui assinaturas ativas" },
        { status: 400 }
      )
    }

    await prisma.plan.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Plano deletado com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar plano", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



