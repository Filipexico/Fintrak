import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { usageLogSchema } from "@/lib/validations/usage"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Listar logs de uso do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const vehicleId = searchParams.get("vehicleId")

    const where: {
      userId: string
      date?: { gte?: Date; lte?: Date }
      vehicleId?: string
    } = { userId }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999) // Incluir o dia inteiro
        where.date.lte = end
      }
    }

    if (vehicleId) {
      where.vehicleId = vehicleId
    }

    const logs = await prisma.usageLog.findMany({
      where,
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
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(logs)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar logs de uso", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar novo log de uso
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    const body = await request.json()
    const validatedData = usageLogSchema.parse(body)

    // Verificar se o veículo pertence ao usuário
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

    const log = await prisma.usageLog.create({
      data: {
        userId,
        vehicleId: validatedData.vehicleId,
        date: validatedData.date,
        distanceKm: validatedData.distanceKm,
        fuelLiters: validatedData.fuelLiters || null,
        energyKwh: validatedData.energyKwh || null,
        notes: validatedData.notes || null,
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

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao criar log de uso", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

