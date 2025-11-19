import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { createSubscriptionSchema } from "@/lib/validations/subscription"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"
import type { Prisma } from "@prisma/client"

// GET - Listar todas as assinaturas
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const planId = searchParams.get("planId")
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")

    const where: Prisma.SubscriptionWhereInput = {}

    if (planId) {
      where.planId = planId
    }

    if (status && ["active", "canceled", "trial", "overdue"].includes(status)) {
      where.status = status as any
    }

    if (userId) {
      where.userId = userId
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar assinaturas", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar nova assinatura
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createSubscriptionSchema.parse(body)

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

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

    const subscription = await prisma.subscription.create({
      data: {
        userId: validatedData.userId,
        planId: validatedData.planId,
        status: validatedData.status || "trial",
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        nextBillingDate: validatedData.nextBillingDate
          ? new Date(validatedData.nextBillingDate)
          : null,
      },
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

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao criar assinatura", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}



