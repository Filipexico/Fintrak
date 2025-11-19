import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { getFinancialSummary, getMonthlyData, getIncomeByPlatform, getExpensesByCategory } from "@/services/report.service"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Dashboard de um usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    // Validar se o usuário existe antes de buscar dados
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    }

    const [summary, monthlyData, platformData, categoryData] = await Promise.all([
      getFinancialSummary(params.id, filters),
      getMonthlyData(
        params.id,
        filters.startDate,
        filters.endDate
      ),
      getIncomeByPlatform(
        params.id,
        filters.startDate,
        filters.endDate
      ),
      getExpensesByCategory(
        params.id,
        filters.startDate,
        filters.endDate
      ),
    ])

    return NextResponse.json({
      summary,
      monthlyData,
      platformData,
      categoryData,
    })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter dashboard do usuário", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

