import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Listar todos os planos ativos
export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        priceMonthly: "asc",
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        priceMonthly: true,
        description: true,
        maxVehicles: true,
        maxPlatforms: true,
      },
    })

    return NextResponse.json(plans)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar planos", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



