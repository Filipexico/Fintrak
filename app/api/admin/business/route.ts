import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"
import { convertToEUR, convertMultipleToEUR } from "@/lib/utils/currency"

// GET - Dashboard de negócios (KPIs e métricas)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get("months") || "6")

    const now = new Date()
    const startDate = startOfMonth(subMonths(now, months - 1))
    const endDate = endOfMonth(now)

    // KPIs principais
    const [
      totalUsers,
      payingUsers,
      freeUsers,
      totalSubscriptions,
      activeSubscriptions,
      overdueSubscriptions,
      totalPayments,
      paidPayments,
      failedPayments,
    ] = await Promise.all([
      // Total de usuários
      prisma.user.count(),
      // Usuários pagantes (com assinatura ativa)
      prisma.user.count({
        where: {
          subscriptions: {
            some: {
              status: "active",
            },
          },
        },
      }),
      // Usuários gratuitos (sem assinatura ativa ou com plano free)
      prisma.user.count({
        where: {
          OR: [
            {
              subscriptions: {
                none: {
                  status: "active",
                },
              },
            },
            {
              subscriptions: {
                some: {
                  status: "active",
                  plan: {
                    name: "free",
                  },
                },
              },
            },
          ],
        },
      }),
      // Total de assinaturas
      prisma.subscription.count(),
      // Assinaturas ativas
      prisma.subscription.count({
        where: { status: "active" },
      }),
      // Assinaturas em débito
      prisma.subscription.count({
        where: { status: "overdue" },
      }),
      // Total de pagamentos no período (com moedas)
      prisma.payment.findMany({
        where: {
          paymentDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          amount: true,
          currency: true,
        },
      }),
      // Pagamentos pagos no período (com moedas)
      prisma.payment.findMany({
        where: {
          paymentDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "paid",
        },
        select: {
          amount: true,
          currency: true,
        },
      }),
      // Pagamentos falhados no período (com moedas)
      prisma.payment.findMany({
        where: {
          paymentDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "failed",
        },
        select: {
          amount: true,
          currency: true,
        },
      }),
    ])

    // Calcular MRR (Monthly Recurring Revenue) - converter para EUR
    const activeSubscriptionsWithPlans = await prisma.subscription.findMany({
      where: { status: "active" },
      include: {
        plan: {
          select: {
            priceMonthly: true,
          },
        },
        user: {
          select: {
            currency: true,
          },
        },
      },
    })

    // Converter MRR para EUR (assumindo que planos estão na moeda do usuário)
    const mrrAmounts = activeSubscriptionsWithPlans.map((sub) => ({
      amount: Number(sub.plan.priceMonthly),
      currency: sub.user.currency || "EUR",
    }))
    const mrr = await convertMultipleToEUR(mrrAmounts)

    // Receita por mês (últimos X meses) - converter para EUR
    const monthlyRevenue = []
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(subMonths(now, i))

      const monthPayments = await prisma.payment.findMany({
        where: {
          paymentDate: {
            gte: monthStart,
            lte: monthEnd,
          },
          status: "paid",
        },
        select: {
          amount: true,
          currency: true,
        },
      })

      // Converter para EUR
      const revenueAmounts = monthPayments.map((p) => ({
        amount: Number(p.amount),
        currency: p.currency,
      }))
      const revenueEUR = await convertMultipleToEUR(revenueAmounts)

      monthlyRevenue.push({
        month: format(monthStart, "yyyy-MM"),
        monthLabel: format(monthStart, "MMM/yyyy"),
        revenue: revenueEUR,
      })
    }

    // Novos usuários por mês
    const monthlyUsers = []
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(subMonths(now, i))

      const monthUsersCount = await prisma.user.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })

      monthlyUsers.push({
        month: format(monthStart, "yyyy-MM"),
        monthLabel: format(monthStart, "MMM/yyyy"),
        count: monthUsersCount,
      })
    }

    // Top 5 dias com maior receita - converter para EUR
    const topDaysPayments = await prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
        status: "paid",
      },
      select: {
        paymentDate: true,
        amount: true,
        currency: true,
      },
    })

    // Agrupar por data e converter para EUR
    const daysMap = new Map<string, Array<{ amount: number; currency: string }>>()
    topDaysPayments.forEach((payment) => {
      const dateKey = format(new Date(payment.paymentDate), "yyyy-MM-dd")
      if (!daysMap.has(dateKey)) {
        daysMap.set(dateKey, [])
      }
      daysMap.get(dateKey)!.push({
        amount: Number(payment.amount),
        currency: payment.currency,
      })
    })

    // Converter cada dia para EUR e ordenar
    const topDaysWithEUR = await Promise.all(
      Array.from(daysMap.entries()).map(async ([date, amounts]) => ({
        date,
        revenue: await convertMultipleToEUR(amounts),
      }))
    )

    const topDaysFormatted = topDaysWithEUR
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((day) => ({
        date: format(new Date(day.date), "dd/MM/yyyy"),
        revenue: day.revenue,
      }))

    // Receita do mês atual - converter para EUR
    const currentMonthStart = startOfMonth(now)
    const currentMonthEnd = endOfMonth(now)
    const currentMonthPayments = await prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        status: "paid",
      },
      select: {
        amount: true,
        currency: true,
      },
    })
    const currentMonthRevenueEUR = await convertMultipleToEUR(
      currentMonthPayments.map((p) => ({
        amount: Number(p.amount),
        currency: p.currency,
      }))
    )

    // Receita total (todos os tempos) - converter para EUR
    const allTimePayments = await prisma.payment.findMany({
      where: {
        status: "paid",
      },
      select: {
        amount: true,
        currency: true,
      },
    })
    const allTimeRevenueEUR = await convertMultipleToEUR(
      allTimePayments.map((p) => ({
        amount: Number(p.amount),
        currency: p.currency,
      }))
    )

    // Converter totais do período para EUR
    const totalRevenueInPeriodEUR = await convertMultipleToEUR(
      totalPayments.map((p) => ({
        amount: Number(p.amount),
        currency: p.currency,
      }))
    )

    const paidRevenueInPeriodEUR = await convertMultipleToEUR(
      paidPayments.map((p) => ({
        amount: Number(p.amount),
        currency: p.currency,
      }))
    )

    const failedRevenueInPeriodEUR = await convertMultipleToEUR(
      failedPayments.map((p) => ({
        amount: Number(p.amount),
        currency: p.currency,
      }))
    )

    return NextResponse.json({
      kpis: {
        totalUsers,
        payingUsers,
        freeUsers,
        totalSubscriptions,
        activeSubscriptions,
        overdueSubscriptions,
        mrr: Number(mrr.toFixed(2)),
        currentMonthRevenue: Number(currentMonthRevenueEUR.toFixed(2)),
        allTimeRevenue: Number(allTimeRevenueEUR.toFixed(2)),
        totalPaymentsInPeriod: totalPayments.length,
        paidPaymentsInPeriod: paidPayments.length,
        failedPaymentsInPeriod: failedPayments.length,
        totalRevenueInPeriod: Number(totalRevenueInPeriodEUR.toFixed(2)),
        paidRevenueInPeriod: Number(paidRevenueInPeriodEUR.toFixed(2)),
        failedRevenueInPeriod: Number(failedRevenueInPeriodEUR.toFixed(2)),
      },
      charts: {
        monthlyRevenue,
        monthlyUsers,
      },
      topDays: topDaysFormatted,
      currency: "EUR", // Indicar que todos os valores estão em EUR
    })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter dashboard de negócios", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

