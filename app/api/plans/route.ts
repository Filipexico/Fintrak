import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Listar todos os planos ativos
export async function GET(request: NextRequest) {
  try {
    logger.info("Buscando planos ativos...")
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

    logger.info(`Planos encontrados: ${plans.length}`, undefined, { count: plans.length })

    return NextResponse.json(plans)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar planos", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



