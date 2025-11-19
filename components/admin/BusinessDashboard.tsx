"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Calendar,
  BarChart3,
} from "lucide-react"
import { apiFetch } from "@/lib/utils/api"
import { formatEUR } from "@/lib/utils/currency"
import { logger } from "@/lib/logger"
import { useToastContext } from "@/components/providers/ToastProvider"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface BusinessDashboardData {
  kpis: {
    totalUsers: number
    payingUsers: number
    freeUsers: number
    totalSubscriptions: number
    activeSubscriptions: number
    overdueSubscriptions: number
    mrr: number
    currentMonthRevenue: number
    allTimeRevenue: number
    totalPaymentsInPeriod: number
    paidPaymentsInPeriod: number
    failedPaymentsInPeriod: number
    totalRevenueInPeriod: number
    paidRevenueInPeriod: number
    failedRevenueInPeriod: number
  }
  charts: {
        monthlyRevenue: Array<{ month: string; monthLabel: string; revenue: number }>
        monthlyUsers: Array<{ month: string; monthLabel: string; count: number }>
      }
      topDays: Array<{ date: string; revenue: number }>
      currency?: string
    }

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function BusinessDashboard() {
  const [data, setData] = useState<BusinessDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [months, setMonths] = useState(6)
  const { error: showError } = useToastContext()

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await apiFetch<BusinessDashboardData>(
        `/api/admin/business?months=${months}`
      )
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        setData(result.data)
      }
    } catch (err) {
      logger.error("Erro ao carregar dashboard de negócios", err instanceof Error ? err : undefined)
      showError("Erro ao carregar dados. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months])

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>
  }

  if (!data) {
    return <div className="text-center py-8 text-destructive">Erro ao carregar dados</div>
  }

  const payingVsFreeData = [
    { name: "Pagantes", value: data.kpis.payingUsers, color: "#00C49F" },
    { name: "Gratuitos", value: data.kpis.freeUsers, color: "#8884d8" },
  ]

  return (
    <div className="space-y-6">
      {/* Filtro de período */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Período:</label>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value={3}>Últimos 3 meses</option>
            <option value={6}>Últimos 6 meses</option>
            <option value={12}>Últimos 12 meses</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          💶 Todos os valores exibidos em EUR (Euro)
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data.kpis.payingUsers} pagantes, {data.kpis.freeUsers} gratuitos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatEUR(data.kpis.mrr)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita recorrente mensal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatEUR(data.kpis.currentMonthRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita total: {formatEUR(data.kpis.allTimeRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {data.kpis.overdueSubscriptions} em débito
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Receita por mês */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.charts.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatEUR(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  strokeWidth={2}
                  name="Receita"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Novos usuários por mês */}
        <Card>
          <CardHeader>
            <CardTitle>Novos Usuários por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.charts.monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#00C49F" name="Novos Usuários" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pagantes vs Gratuitos */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Pagantes vs Gratuitos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={payingVsFreeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {payingVsFreeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 dias com maior receita */}
      {data.topDays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Top 5 Dias com Maior Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.topDays.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{day.date}</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">
                    {formatEUR(day.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo de pagamentos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos no Período</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.totalPaymentsInPeriod}</div>
            <p className="text-xs text-muted-foreground">
              {data.kpis.paidPaymentsInPeriod} pagos, {data.kpis.failedPaymentsInPeriod} falhados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita no Período</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatEUR(data.kpis.paidRevenueInPeriod)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {formatEUR(data.kpis.totalRevenueInPeriod)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {data.kpis.activeSubscriptions} ativas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

