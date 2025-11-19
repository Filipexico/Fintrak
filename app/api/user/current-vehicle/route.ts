import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// PUT - Atualizar veículo atual do usuário
export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    const body = await request.json()
    const { vehicleId } = body

    // Se vehicleId for fornecido, verificar se pertence ao usuário
    if (vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: {
          id: vehicleId,
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

    // Atualizar currentVehicleId do usuário
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        currentVehicleId: vehicleId || null,
      },
      select: {
        id: true,
        currentVehicleId: true,
      },
    })

    return NextResponse.json({
      message: "Veículo atual atualizado com sucesso",
      currentVehicleId: user.currentVehicleId,
    })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao atualizar veículo atual", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Atualizar veículo atual (alias para PUT)
export async function POST(request: NextRequest) {
  return PUT(request)
}

// GET - Obter veículo atual do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentVehicleId: true,
        currentVehicle: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    })

    return NextResponse.json({
      currentVehicleId: user?.currentVehicleId || null,
      currentVehicle: user?.currentVehicle || null,
    })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter veículo atual", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
