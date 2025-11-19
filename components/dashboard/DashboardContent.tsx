"use client"

import { useEffect, useState } from "react"
import { KPICard } from "./KPICard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MonthlyChart } from "@/components/charts/MonthlyChart"
import { PlatformChart } from "@/components/charts/PlatformChart"
import { CategoryChart } from "@/components/charts/CategoryChart"
import { DistanceChart } from "@/components/charts/DistanceChart"
import { FuelChart } from "@/components/charts/FuelChart"
import { Loading, LoadingCard } from "@/components/ui/loading"
import { useToastContext } from "@/components/providers/ToastProvider"
import { DollarSign, TrendingUp, TrendingDown, Receipt, Route, Fuel, Gauge, Download } from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { formatCurrency } from "@/lib/utils/format"
import { exportFinancialReport, exportVehicleReport } from "@/lib/utils/export"

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

interface VehicleSummary {
  totalDistance: number
  totalFuel: number
  totalEnergy: number
  avgKmPerLiter: number | null
  avgKmPerKwh: number | null
  totalLogs: number
  logsWithFuel: number
  logsWithEnergy: number
}

interface VehicleMetrics {
  summary: VehicleSummary
  dailyDistance: Array<{ date: string; distance: number }>
  dailyFuel: Array<{ date: string; fuel?: number; energy?: number }>
  costPerKm: {
    totalDistance: number
    totalFuelCost: number
    costPerKm: number | null
    currency: string
  }
}

export function DashboardContent() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [platformData, setPlatformData] = useState<PlatformIncome[]>([])
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([])
  const [vehicleMetrics, setVehicleMetrics] = useState<VehicleMetrics | null>(null)
  const [vehicles, setVehicles] = useState<Array<{ id: string; name: string }>>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { error: showError } = useToastContext()
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 5)), "yyyy-MM-dd"),
    endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  })

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles")
      if (res.ok) {
        const data = await res.json()
        setVehicles(data)
      }
    } catch (error) {
      // Silenciar erro - veículos são opcionais
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })

      const vehicleParams = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      if (selectedVehicle) {
        vehicleParams.append("vehicleId", selectedVehicle)
      }

      const [summaryRes, monthlyRes, platformRes, categoryRes, vehicleRes] =
        await Promise.all([
          fetch(`/api/reports/summary?${params}`),
          fetch(`/api/reports/monthly?${params}`),
          fetch(`/api/reports/platforms?${params}`),
          fetch(`/api/reports/categories?${params}`),
          fetch(`/api/reports/vehicles?${vehicleParams}`),
        ])

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData)
      } else {
        // Verificar se é um erro real (não autenticação ou dados vazios)
        const errorData = await summaryRes.json().catch(() => ({ error: "Erro desconhecido" }))
        // Só mostrar erro se for erro de servidor (500+) ou erro crítico
        // Erros 401/403 devem redirecionar para login, não mostrar toast
        if (summaryRes.status >= 500) {
          showError(errorData.error || "Erro ao carregar dados do dashboard")
        } else if (summaryRes.status === 401 || summaryRes.status === 403) {
          // Redirecionar para login sem mostrar erro
          window.location.href = "/login"
          return
        }
      }

      if (monthlyRes.ok) {
        setMonthlyData(await monthlyRes.json())
      }
      
      if (platformRes.ok) {
        setPlatformData(await platformRes.json())
      }
      
      if (categoryRes.ok) {
        setCategoryData(await categoryRes.json())
      }
      
      if (vehicleRes.ok) {
        setVehicleMetrics(await vehicleRes.json())
      }
      
      // Não mostrar erro para dados secundários - eles podem não existir ainda
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      // Só mostrar erro se não for um erro de rede/abort (que pode ser normal)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Erro de rede - pode ser temporário, não mostrar erro
        console.warn("Erro de rede ao carregar dados")
      } else {
        showError("Erro ao carregar dados. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, selectedVehicle])

  // Usar a função formatCurrency centralizada
  const formatCurrencyValue = (value: number, currency: string = "BRL") => {
    return formatCurrency(value, currency, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  if (loading) {
    return <LoadingCard />
  }

  // Se não há summary, mostrar um estado vazio em vez de erro
  if (!summary) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Nenhum dado disponível para o período selecionado. Comece adicionando receitas e despesas.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Data e Exportação */}
      <div className="flex items-end gap-4">
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (summary && monthlyData && platformData && categoryData) {
                exportFinancialReport(
                  { summary, monthlyData, platformData, categoryData },
                  "pdf"
                )
              }
            }}
            disabled={!summary}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (summary && monthlyData && platformData && categoryData) {
                exportFinancialReport(
                  { summary, monthlyData, platformData, categoryData },
                  "xlsx"
                )
              }
            }}
            disabled={!summary}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receita Total"
          value={formatCurrencyValue(summary.totalIncome, summary.currency)}
          icon={DollarSign}
        />
        <KPICard
          title="Despesas Totais"
          value={formatCurrencyValue(summary.totalExpenses, summary.currency)}
          icon={TrendingDown}
        />
        <KPICard
          title="Lucro Líquido"
          value={formatCurrencyValue(summary.netProfit, summary.currency)}
          icon={TrendingUp}
        />
        <KPICard
          title="Imposto Estimado"
          value={formatCurrencyValue(summary.estimatedTax, summary.currency)}
          icon={Receipt}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyChart data={monthlyData} currency={summary.currency} />
        <PlatformChart data={platformData} currency={summary.currency} />
      </div>

      <CategoryChart data={categoryData} currency={summary.currency} />

      {/* Seção de Veículos e Distância */}
      {vehicleMetrics && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Veículos e Distância</h2>
              <p className="text-muted-foreground">
                Métricas de uso de veículos e consumo de combustível
              </p>
            </div>
            <div className="flex items-center gap-4">
              {vehicles.length > 0 && (
                <div>
                  <label className="text-sm font-medium mr-2">Filtrar por veículo:</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Todos os veículos</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (vehicleMetrics) {
                      exportVehicleReport(vehicleMetrics, "pdf")
                    }
                  }}
                  disabled={!vehicleMetrics}
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (vehicleMetrics) {
                      exportVehicleReport(vehicleMetrics, "xlsx")
                    }
                  }}
                  disabled={!vehicleMetrics}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </div>

          {/* KPIs de Veículos */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Distância Total"
              value={`${vehicleMetrics.summary.totalDistance.toFixed(2)} km`}
              icon={Route}
            />
            <KPICard
              title="Combustível/Energia Total"
              value={
                vehicleMetrics.summary.totalEnergy > 0
                  ? `${vehicleMetrics.summary.totalEnergy.toFixed(2)} kWh`
                  : vehicleMetrics.summary.totalFuel > 0
                  ? `${vehicleMetrics.summary.totalFuel.toFixed(2)} L`
                  : "N/A"
              }
              icon={Fuel}
            />
            <KPICard
              title="Eficiência Média"
              value={
                vehicleMetrics.summary.avgKmPerKwh
                  ? `${vehicleMetrics.summary.avgKmPerKwh} km/kWh`
                  : vehicleMetrics.summary.avgKmPerLiter
                  ? `${vehicleMetrics.summary.avgKmPerLiter} km/L`
                  : "N/A"
              }
              icon={Gauge}
            />
            <KPICard
              title="Custo por km"
              value={
                vehicleMetrics.costPerKm.costPerKm
                  ? formatCurrencyValue(
                      vehicleMetrics.costPerKm.costPerKm,
                      vehicleMetrics.costPerKm.currency
                    )
                  : "N/A"
              }
              icon={DollarSign}
            />
          </div>

          {/* Gráficos de Veículos */}
          <div className="grid gap-6 md:grid-cols-2">
            {vehicleMetrics.dailyDistance.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distância Diária</CardTitle>
                </CardHeader>
                <CardContent>
                  <DistanceChart data={vehicleMetrics.dailyDistance} />
                </CardContent>
              </Card>
            )}

            {vehicleMetrics.dailyFuel.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {vehicleMetrics.dailyFuel.some((d) => d.energy)
                      ? "Consumo de Energia Diário"
                      : "Consumo de Combustível Diário"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FuelChart data={vehicleMetrics.dailyFuel} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

