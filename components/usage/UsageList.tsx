"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingCard } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Plus, Edit, Trash2, Route } from "lucide-react"
import { UsageForm } from "./UsageForm"
import { apiFetch, apiDelete } from "@/lib/utils/api"
import { logger } from "@/lib/logger"
import { formatDate } from "@/lib/utils/format"

interface UsageLog {
  id: string
  vehicleId: string
  date: string
  distanceKm: number
  fuelLiters: number | null
  energyKwh: number | null
  notes: string | null
  vehicle: {
    id: string
    name: string
    type: string | null
    fuelType: string | null
  }
}

export function UsageList() {
  const [logs, setLogs] = useState<UsageLog[]>([])
  const [vehicles, setVehicles] = useState<Array<{ id: string; name: string; fuelType: string | null }>>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState<UsageLog | null>(null)
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    vehicleId: "",
  })
  const { success, error: showError } = useToastContext()

  const fetchVehicles = async () => {
    try {
      const result = await apiFetch<Array<{ id: string; name: string; fuelType: string | null }>>("/api/vehicles")
      if (result.data) {
        setVehicles(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar veículos", error instanceof Error ? error : undefined)
    }
  }

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)
      if (filters.vehicleId) params.append("vehicleId", filters.vehicleId)

      const result = await apiFetch<UsageLog[]>(`/api/usage?${params.toString()}`)
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        setLogs(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar logs de uso", error instanceof Error ? error : undefined)
      showError("Erro ao carregar logs. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handleEdit = (log: UsageLog) => {
    setEditingLog(log)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este registro?")) {
      return
    }

    try {
      const result = await apiDelete(`/api/usage/${id}`)
      if (result.error) {
        showError(result.error)
      } else {
        success("Registro deletado com sucesso")
        fetchLogs()
      }
    } catch (error) {
      logger.error("Erro ao deletar log", error instanceof Error ? error : undefined)
      showError("Erro ao deletar registro. Tente novamente.")
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingLog(null)
    fetchLogs()
  }

  const calculateKmPerLiter = (distance: number, fuel: number | null): number | null => {
    if (!fuel || fuel === 0) return null
    return Number((distance / fuel).toFixed(2))
  }

  const calculateKmPerKwh = (distance: number, energy: number | null): number | null => {
    if (!energy || energy === 0) return null
    return Number((distance / energy).toFixed(2))
  }

  if (loading && logs.length === 0) {
    return <LoadingCard />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Registros de Uso</h2>
          <p className="text-muted-foreground">
            Registre distâncias percorridas e consumo de combustível
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Data Inicial</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data Final</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Veículo</label>
              <select
                value={filters.vehicleId}
                onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ startDate: "", endDate: "", vehicleId: "" })}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <UsageForm
          log={editingLog}
          vehicles={vehicles}
          onClose={handleFormClose}
        />
      )}

      {logs.length === 0 ? (
        <EmptyState
          icon={Route}
          title="Nenhum registro encontrado"
          description="Adicione seu primeiro registro de uso para começar a acompanhar distâncias e consumo."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left text-sm font-medium">Data</th>
                <th className="p-3 text-left text-sm font-medium">Veículo</th>
                <th className="p-3 text-right text-sm font-medium">Distância (km)</th>
                <th className="p-3 text-right text-sm font-medium">Combustível/Energia</th>
                <th className="p-3 text-right text-sm font-medium">Eficiência</th>
                <th className="p-3 text-left text-sm font-medium">Notas</th>
                <th className="p-3 text-center text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isElectric = log.vehicle.fuelType === "electric"
                const kmPerLiter = !isElectric ? calculateKmPerLiter(log.distanceKm, log.fuelLiters) : null
                const kmPerKwh = isElectric ? calculateKmPerKwh(log.distanceKm, log.energyKwh) : null
                return (
                  <tr key={log.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 text-sm">{formatDate(log.date)}</td>
                    <td className="p-3 text-sm">{log.vehicle.name}</td>
                    <td className="p-3 text-right text-sm font-medium">
                      {log.distanceKm.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-sm">
                      {isElectric
                        ? log.energyKwh
                          ? `${log.energyKwh.toFixed(2)} kWh`
                          : "-"
                        : log.fuelLiters
                        ? `${log.fuelLiters.toFixed(2)} L`
                        : "-"}
                    </td>
                    <td className="p-3 text-right text-sm font-medium">
                      {isElectric
                        ? kmPerKwh
                          ? `${kmPerKwh} km/kWh`
                          : "-"
                        : kmPerLiter
                        ? `${kmPerLiter} km/L`
                        : "-"}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {log.notes || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(log)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(log.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

