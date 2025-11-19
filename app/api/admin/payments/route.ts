import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { createPaymentSchema } from "@/lib/validations/payment"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"
import { sendPaymentEmail } from "@/lib/utils/email"
import type { Prisma } from "@prisma/client"

// GET - Listar todos os pagamentos
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")
    const paymentMethod = searchParams.get("paymentMethod")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: Prisma.PaymentWhereInput = {}

    if (status && ["paid", "failed", "refunded", "pending"].includes(status)) {
      where.status = status as any
    }

    if (userId) {
      where.userId = userId
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod
    }

    if (startDate || endDate) {
      where.paymentDate = {}
      if (startDate) {
        where.paymentDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.paymentDate.lte = new Date(endDate)
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          select: {
            id: true,
            plan: {
              select: {
                name: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    })

    return NextResponse.json(payments)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar pagamentos", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar novo pagamento
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createPaymentSchema.parse(body)

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

    // Se subscriptionId foi fornecido, verificar se existe
    if (validatedData.subscriptionId) {
      const subscription = await prisma.subscription.findUnique({
        where: { id: validatedData.subscriptionId },
      })

      if (!subscription) {
        return NextResponse.json(
          { error: "Assinatura não encontrada" },
          { status: 404 }
        )
      }
    }

    const payment = await prisma.payment.create({
      data: {
        userId: validatedData.userId,
        subscriptionId: validatedData.subscriptionId || null,
        amount: validatedData.amount,
        currency: validatedData.currency || "BRL",
        paymentDate: new Date(validatedData.paymentDate),
        paymentMethod: validatedData.paymentMethod,
        status: validatedData.status || "pending",
        description: validatedData.description,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          select: {
            id: true,
            plan: {
              select: {
                name: true,
                displayName: true,
              },
            },
          },
        },
      },
    })

    // Enviar email quando um pagamento é registrado
    await sendPaymentEmail({
      userName: payment.user.name,
      userEmail: payment.user.email,
      paymentAmount: payment.amount.toNumber(),
      paymentCurrency: payment.currency,
      paymentMethod: payment.paymentMethod,
      paymentDate: new Date(payment.paymentDate).toLocaleDateString("pt-BR"),
      planName: payment.subscription?.plan.name,
      planDisplayName: payment.subscription?.plan.displayName,
      paymentStatus: payment.status,
      description: payment.description || undefined,
    }).catch((error) => {
      logger.error("Erro ao enviar email de pagamento", error instanceof Error ? error : undefined)
      // Não bloquear o pagamento se o email falhar
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao criar pagamento", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}



