import { prisma } from "@/lib/prisma"
import { createIncomeWhere, createExpenseWhere, type IncomeWhereInput, type ExpenseWhereInput } from "@/types/prisma"
import { logger } from "@/lib/logger"

export interface ReportFilters {
  startDate?: Date
  endDate?: Date
  platformId?: string
  category?: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  estimatedTax: number
  currency: string
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  profit: number
}

export interface PlatformIncome {
  platformId: string | null
  platformName: string
  total: number
  percentage: number
}

export interface CategoryExpense {
  category: string
  total: number
  percentage: number
}

/**
 * Calcula resumo financeiro do usuário
 */
export async function getFinancialSummary(
  userId: string,
  filters?: ReportFilters
): Promise<FinancialSummary> {
  const whereIncome: IncomeWhereInput = createIncomeWhere(userId, {
    platformId: filters?.platformId,
    startDate: filters?.startDate,
    endDate: filters?.endDate,
  })

  const whereExpense: ExpenseWhereInput = createExpenseWhere(userId, {
    category: filters?.category,
    startDate: filters?.startDate,
    endDate: filters?.endDate,
  })

  // Buscar receitas e despesas
  const [incomes, expenses, user] = await Promise.all([
    prisma.income.findMany({ where: whereIncome }),
    prisma.expense.findMany({ where: whereExpense }),
    prisma.user.findUnique({ where: { id: userId }, select: { currency: true, country: true } }),
  ])

  // Calcular totais
  const totalIncome = incomes.reduce(
    (sum, income) => sum + Number(income.amount),
    0
  )
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  )
  const netProfit = totalIncome - totalExpenses

  // Calcular imposto estimado
  let estimatedTax = 0
  if (user?.country) {
    const taxRule = await prisma.taxRule.findUnique({
      where: { country: user.country, isActive: true },
    })
    if (taxRule && netProfit > 0) {
      estimatedTax = Number(netProfit) * Number(taxRule.percentage)
    }
  }

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    estimatedTax,
    currency: user?.currency || "BRL",
  }
}

/**
 * Obtém dados mensais de receita vs despesas
 */
export async function getMonthlyData(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<MonthlyData[]> {
  const whereIncome: IncomeWhereInput = createIncomeWhere(userId, {
    startDate,
    endDate,
  })

  const whereExpense: ExpenseWhereInput = createExpenseWhere(userId, {
    startDate,
    endDate,
  })

  const [incomes, expenses] = await Promise.all([
    prisma.income.findMany({ where: whereIncome }),
    prisma.expense.findMany({ where: whereExpense }),
  ])

  // Agrupar por mês
  const monthlyMap = new Map<string, { income: number; expenses: number }>()

  incomes.forEach((income) => {
    const month = new Date(income.date).toISOString().slice(0, 7) // YYYY-MM
    const current = monthlyMap.get(month) || { income: 0, expenses: 0 }
    monthlyMap.set(month, {
      ...current,
      income: current.income + Number(income.amount),
    })
  })

  expenses.forEach((expense) => {
    const month = new Date(expense.date).toISOString().slice(0, 7) // YYYY-MM
    const current = monthlyMap.get(month) || { income: 0, expenses: 0 }
    monthlyMap.set(month, {
      ...current,
      expenses: current.expenses + Number(expense.amount),
    })
  })

  // Converter para array e formatar
  const monthlyData: MonthlyData[] = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      monthKey: month, // Manter para ordenação
      month: new Date(month + "-01").toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      }),
      income: data.income,
      expenses: data.expenses,
      profit: data.income - data.expenses,
    }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .map(({ monthKey, ...rest }) => rest) // Remover monthKey do resultado final

  return monthlyData
}

/**
 * Obtém receita por plataforma
 */
export async function getIncomeByPlatform(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<PlatformIncome[]> {
  const where: IncomeWhereInput = createIncomeWhere(userId, {
    startDate,
    endDate,
  })

  const incomes = await prisma.income.findMany({
    where,
    include: {
      platform: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  // Calcular total geral
  const totalIncome = incomes.reduce(
    (sum, income) => sum + Number(income.amount),
    0
  )

  // Agrupar por plataforma
  const platformMap = new Map<string, { name: string; total: number }>()

  incomes.forEach((income) => {
    const key = income.platformId || "sem-plataforma"
    const name = income.platform?.name || "Sem Plataforma"
    const current = platformMap.get(key) || { name, total: 0 }
    platformMap.set(key, {
      name,
      total: current.total + Number(income.amount),
    })
  })

  // Converter para array e calcular porcentagens
  const platformData: PlatformIncome[] = Array.from(platformMap.entries())
    .map(([platformId, data]) => ({
      platformId: platformId === "sem-plataforma" ? null : platformId,
      platformName: data.name,
      total: data.total,
      percentage: totalIncome > 0 ? (data.total / totalIncome) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)

  return platformData
}

/**
 * Obtém despesas por categoria
 */
export async function getExpensesByCategory(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<CategoryExpense[]> {
  const where: ExpenseWhereInput = createExpenseWhere(userId, {
    startDate,
    endDate,
  })

  const expenses = await prisma.expense.findMany({ where })

  // Calcular total geral
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  )

  // Agrupar por categoria
  const categoryMap = new Map<string, number>()

  expenses.forEach((expense) => {
    const current = categoryMap.get(expense.category) || 0
    categoryMap.set(expense.category, current + Number(expense.amount))
  })

  // Converter para array e calcular porcentagens
  const categoryData: CategoryExpense[] = Array.from(categoryMap.entries())
    .map(([category, total]) => ({
      category,
      total,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)

  return categoryData
}

