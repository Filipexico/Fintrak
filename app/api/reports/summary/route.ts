import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { getFinancialSummary } from "@/services/report.service"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const platformId = searchParams.get("platformId")
    const category = searchParams.get("category")

    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      platformId: platformId || undefined,
      category: category || undefined,
    }

    const summary = await getFinancialSummary(userId, filters)

    return NextResponse.json(summary)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter resumo financeiro", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

