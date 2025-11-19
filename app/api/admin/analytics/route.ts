import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Analytics globais
export async function GET() {
  try {
    await requireAdmin()

    // Estatísticas gerais
    const [
      totalUsers,
      activeUsers,
      totalIncomes,
      totalExpenses,
      totalPlatforms,
      usersByCountry,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.income.aggregate({
        _sum: { amount: true },
        _count: true,
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        _count: true,
      }),
      prisma.platform.count({ where: { isActive: true } }),
      prisma.user.groupBy({
        by: ["country"],
        _count: true,
        where: { isActive: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalIncomes: {
        count: totalIncomes._count,
        sum: Number(totalIncomes._sum.amount || 0),
      },
      totalExpenses: {
        count: totalExpenses._count,
        sum: Number(totalExpenses._sum.amount || 0),
      },
      totalPlatforms,
      usersByCountry: usersByCountry.map((item) => ({
        country: item.country,
        count: item._count,
      })),
      recentUsers,
    })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter analytics", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

