import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { vehicleSchema } from "@/lib/validations/vehicle"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter veículo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: params.id,
        userId, // Garantir que o veículo pertence ao usuário
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter veículo", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar veículo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar se o veículo existe e pertence ao usuário
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = vehicleSchema.parse(body)

    // Prevenir mass assignment - apenas campos permitidos
    const updateData: {
      name: string
      type: string | null
      plate: string | null
      fuelType: string | null
      notes: string | null
      isActive: boolean
    } = {
      name: validatedData.name,
      type: validatedData.type || null,
      plate: validatedData.plate || null,
      fuelType: validatedData.fuelType || null,
      notes: validatedData.notes || null,
      isActive: validatedData.isActive ?? true,
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar veículo", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Desativar veículo (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar se o veículo existe e pertence ao usuário
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 })
    }

    // Soft delete: desativar o veículo
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Veículo desativado com sucesso", vehicle })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao desativar veículo", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



