import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { vehicleSchema } from "@/lib/validations/vehicle"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Listar veículos do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"

    const where: { userId: string; isActive?: boolean } = { userId }
    if (!includeInactive) {
      where.isActive = true
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: [
        { isActive: "desc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar veículos", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar novo veículo
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar limite de veículos do plano do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: "active",
          },
          include: {
            plan: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Contar veículos ativos do usuário
    const activeVehiclesCount = await prisma.vehicle.count({
      where: {
        userId,
        isActive: true,
      },
    })

    // Obter limite do plano
    const activeSubscription = user.subscriptions[0]
    const plan = activeSubscription?.plan
    const maxVehicles = plan?.maxVehicles

    // Verificar se excedeu o limite (null = unlimited)
    if (maxVehicles !== null && activeVehiclesCount >= maxVehicles) {
      return NextResponse.json(
        {
          error: "Limite de veículos atingido",
          details: {
            current: activeVehiclesCount,
            max: maxVehicles,
            plan: plan?.displayName || "Free",
            upgradeRequired: true,
          },
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = vehicleSchema.parse(body)

    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        name: validatedData.name,
        type: validatedData.type || null,
        plate: validatedData.plate || null,
        fuelType: validatedData.fuelType || null,
        notes: validatedData.notes || null,
        isActive: validatedData.isActive ?? true,
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao criar veículo", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

