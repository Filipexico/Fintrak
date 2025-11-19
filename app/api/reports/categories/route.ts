import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { getExpensesByCategory } from "@/services/report.service"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const data = await getExpensesByCategory(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )

    return NextResponse.json(data)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter despesas por categoria", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

