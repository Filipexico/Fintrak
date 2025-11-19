import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { maintenanceSchema } from "@/lib/validations/maintenance"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter manutenção específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    const maintenance = await prisma.maintenance.findFirst({
      where: {
        id: params.id,
        userId,
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

    if (!maintenance) {
      return NextResponse.json({ error: "Manutenção não encontrada" }, { status: 404 })
    }

    return NextResponse.json(maintenance)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter manutenção", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar manutenção
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    const existingMaintenance = await prisma.maintenance.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingMaintenance) {
      return NextResponse.json({ error: "Manutenção não encontrada" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = maintenanceSchema.parse(body)

    // Verificar se o veículo pertence ao usuário (se foi alterado)
    if (validatedData.vehicleId !== existingMaintenance.vehicleId) {
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

    const updateData: {
      vehicleId: string
      date: Date
      type: string
      description: string | null
      cost: number | null
      currency: string
      mileage: number | null
      notes: string | null
    } = {
      vehicleId: validatedData.vehicleId,
      date: new Date(validatedData.date),
      type: validatedData.type,
      description: validatedData.description || null,
      cost: validatedData.cost || null,
      currency: validatedData.currency || "BRL",
      mileage: validatedData.mileage || null,
      notes: validatedData.notes || null,
    }

    const maintenance = await prisma.maintenance.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(maintenance)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar manutenção", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar manutenção
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    const existingMaintenance = await prisma.maintenance.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!existingMaintenance) {
      return NextResponse.json({ error: "Manutenção não encontrada" }, { status: 404 })
    }

    await prisma.maintenance.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Manutenção deletada com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar manutenção", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



