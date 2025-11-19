import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { updatePaymentSchema } from "@/lib/validations/payment"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter pagamento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
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

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(payment)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter pagamento", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar pagamento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = updatePaymentSchema.parse(body)

    const updateData: any = {}

    if (validatedData.amount !== undefined) {
      updateData.amount = validatedData.amount
    }

    if (validatedData.currency) {
      updateData.currency = validatedData.currency
    }

    if (validatedData.paymentDate) {
      updateData.paymentDate = new Date(validatedData.paymentDate)
    }

    if (validatedData.paymentMethod) {
      updateData.paymentMethod = validatedData.paymentMethod
    }

    if (validatedData.status) {
      updateData.status = validatedData.status
    }

    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description
    }

    const payment = await prisma.payment.update({
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

    return NextResponse.json(payment)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar pagamento", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar pagamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    await prisma.payment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Pagamento deletado com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar pagamento", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



