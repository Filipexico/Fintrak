"use client"

import { useEffect, useState } from "react"
import { KPICard } from "@/components/dashboard/KPICard"
import { MonthlyChart } from "@/components/charts/MonthlyChart"
import { PlatformChart } from "@/components/charts/PlatformChart"
import { CategoryChart } from "@/components/charts/CategoryChart"
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"

interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  estimatedTax: number
  currency: string
}

interface MonthlyData {
  month: string
  income: number
  expenses: number
  profit: number
}

interface PlatformIncome {
  platformId: string | null
  platformName: string
  total: number
  percentage: number
}

interface CategoryExpense {
  category: string
  total: number
  percentage: number
}

interface UserDashboardViewProps {
  userId: string
  currency: string
}

export function UserDashboardView({ userId, currency }: UserDashboardViewProps) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [platformData, setPlatformData] = useState<PlatformIncome[]>([])
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 5)), "yyyy-MM-dd"),
    endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })

      const response = await fetch(`/api/admin/users/${userId}/dashboard?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSummary(data.summary)
        setMonthlyData(data.monthlyData)
        setPlatformData(data.platformData)
        setCategoryData(data.categoryData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userId, dateRange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!summary) {
    return <div>Erro ao carregar dados</div>
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Data */}
      <div className="flex gap-4">
        <div>
          <label className="text-sm font-medium">Data Inicial</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Data Final</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receita Total"
          value={formatCurrency(summary.totalIncome)}
          icon={DollarSign}
        />
        <KPICard
          title="Despesas Totais"
          value={formatCurrency(summary.totalExpenses)}
          icon={TrendingDown}
        />
        <KPICard
          title="Lucro Líquido"
          value={formatCurrency(summary.netProfit)}
          icon={TrendingUp}
        />
        <KPICard
          title="Imposto Estimado"
          value={formatCurrency(summary.estimatedTax)}
          icon={Receipt}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyChart data={monthlyData} currency={summary.currency} />
        <PlatformChart data={platformData} currency={summary.currency} />
      </div>

      <CategoryChart data={categoryData} currency={summary.currency} />
    </div>
  )
}



