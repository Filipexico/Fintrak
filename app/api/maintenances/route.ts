import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { maintenanceSchema } from "@/lib/validations/maintenance"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Listar manutenções do usuário
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
        end.setHours(23, 59, 59, 999)
        where.date.lte = end
      }
    }

    if (vehicleId) {
      where.vehicleId = vehicleId
    }

    const maintenances = await prisma.maintenance.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(maintenances)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar manutenções", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar nova manutenção
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    const body = await request.json()
    const validatedData = maintenanceSchema.parse(body)

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

    const maintenance = await prisma.maintenance.create({
      data: {
        userId,
        vehicleId: validatedData.vehicleId,
        date: new Date(validatedData.date),
        type: validatedData.type,
        description: validatedData.description || null,
        cost: validatedData.cost || null,
        currency: validatedData.currency || "BRL",
        mileage: validatedData.mileage || null,
        notes: validatedData.notes || null,
      },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })

    return NextResponse.json(maintenance, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao criar manutenção", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}



