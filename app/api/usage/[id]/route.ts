import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { usageLogSchema } from "@/lib/validations/usage"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter log específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    const log = await prisma.usageLog.findFirst({
      where: {
        id: params.id,
        userId, // Garantir que o log pertence ao usuário
      },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            fuelType: true,
          },
        },
      },
    })

    if (!log) {
      return NextResponse.json({ error: "Log não encontrado" }, { status: 404 })
    }

    return NextResponse.json(log)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter log de uso", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar log de uso
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar se o log existe e pertence ao usuário
    const existingLog = await prisma.usageLog.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingLog) {
      return NextResponse.json({ error: "Log não encontrado" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = usageLogSchema.parse(body)

    // Verificar se o veículo pertence ao usuário (se foi alterado)
    if (validatedData.vehicleId !== existingLog.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: {
          id: validatedData.vehicleId,
          userId,
        },
      })

      if (!vehicle) {
        return NextResponse.json(
          { error: "Veículo não encontrado ou não pertence ao usuário" },
          { status: 404 }
        )
      }
    }

    // Prevenir mass assignment
    const updateData: {
      vehicleId: string
      date: Date
      distanceKm: number
      fuelLiters: number | null
      energyKwh: number | null
      notes: string | null
    } = {
      vehicleId: validatedData.vehicleId,
      date: validatedData.date,
      distanceKm: validatedData.distanceKm,
      fuelLiters: validatedData.fuelLiters || null,
      energyKwh: validatedData.energyKwh || null,
      notes: validatedData.notes || null,
    }

    const log = await prisma.usageLog.update({
      where: { id: params.id },
      data: updateData,
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            fuelType: true,
          },
        },
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar log de uso", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar log de uso
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar se o log existe e pertence ao usuário
    const existingLog = await prisma.usageLog.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingLog) {
      return NextResponse.json({ error: "Log não encontrado" }, { status: 404 })
    }

    await prisma.usageLog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Log deletado com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar log de uso", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

