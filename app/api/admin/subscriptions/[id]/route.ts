import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { updateSubscriptionSchema } from "@/lib/validations/subscription"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter assinatura específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            displayName: true,
            priceMonthly: true,
          },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
          take: 10,
        },
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(subscription)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter assinatura", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar assinatura
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = updateSubscriptionSchema.parse(body)

    const updateData: any = {}

    if (validatedData.planId) {
      // Verificar se plano existe
      const plan = await prisma.plan.findUnique({
        where: { id: validatedData.planId },
      })

      if (!plan) {
        return NextResponse.json(
          { error: "Plano não encontrado" },
          { status: 404 }
        )
      }

      updateData.planId = validatedData.planId
    }

    if (validatedData.status) {
      updateData.status = validatedData.status
    }

    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }

    if (validatedData.endDate !== undefined) {
      updateData.endDate = validatedData.endDate ? new Date(validatedData.endDate) : null
    }

    if (validatedData.nextBillingDate !== undefined) {
      updateData.nextBillingDate = validatedData.nextBillingDate
        ? new Date(validatedData.nextBillingDate)
        : null
    }

    const subscription = await prisma.subscription.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            displayName: true,
            priceMonthly: true,
          },
        },
      },
    })

    return NextResponse.json(subscription)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar assinatura", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar assinatura
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    await prisma.subscription.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Assinatura deletada com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar assinatura", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



