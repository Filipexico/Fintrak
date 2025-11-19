import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import {
  getVehicleSummary,
  getDailyDistanceData,
  getDailyFuelData,
  getCostPerKm,
} from "@/services/vehicle.service"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    const { searchParams } = new URL(request.url)
    const startDateStr = searchParams.get("startDate")
    const endDateStr = searchParams.get("endDate")
    const vehicleId = searchParams.get("vehicleId") || undefined

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "startDate e endDate são obrigatórios" },
        { status: 400 }
      )
    }

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    const [summary, dailyDistance, dailyFuel, costPerKm] = await Promise.all([
      getVehicleSummary(userId, startDate, endDate, vehicleId),
      getDailyDistanceData(userId, startDate, endDate, vehicleId),
      getDailyFuelData(userId, startDate, endDate, vehicleId),
      getCostPerKm(userId, startDate, endDate, vehicleId),
    ])

    return NextResponse.json({
      summary,
      dailyDistance,
      dailyFuel,
      costPerKm,
    })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter métricas de veículos", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



