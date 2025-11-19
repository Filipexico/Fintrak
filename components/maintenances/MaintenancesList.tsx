"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingCard } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Plus, Edit, Trash2, Wrench } from "lucide-react"
import { MaintenanceForm } from "./MaintenanceForm"
import { apiFetch, apiDelete } from "@/lib/utils/api"
import { logger } from "@/lib/logger"
import { formatDate, formatCurrency } from "@/lib/utils/format"
import { maintenanceTypeLabels } from "@/lib/constants"

interface Maintenance {
  id: string
  vehicleId: string
  date: string
  type: string
  description: string | null
  cost: number | null
  currency: string
  mileage: number | null
  notes: string | null
  vehicle: {
    id: string
    name: string
    type: string | null
  }
}

export function MaintenancesList() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [vehicles, setVehicles] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null)
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    vehicleId: "",
  })
  const { success, error: showError } = useToastContext()

  const fetchVehicles = async () => {
    try {
      const result = await apiFetch<Array<{ id: string; name: string }>>("/api/vehicles")
      if (result.data) {
        setVehicles(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar veículos", error instanceof Error ? error : undefined)
    }
  }

  const fetchMaintenances = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)
      if (filters.vehicleId) params.append("vehicleId", filters.vehicleId)

      const result = await apiFetch<Maintenance[]>(`/api/maintenances?${params.toString()}`)
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        setMaintenances(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar manutenções", error instanceof Error ? error : undefined)
      showError("Erro ao carregar manutenções. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    fetchMaintenances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handleEdit = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta manutenção?")) {
      return
    }

    try {
      const result = await apiDelete(`/api/maintenances/${id}`)
      if (result.error) {
        showError(result.error)
      } else {
        success("Manutenção deletada com sucesso")
        fetchMaintenances()
      }
    } catch (error) {
      logger.error("Erro ao deletar manutenção", error instanceof Error ? error : undefined)
      showError("Erro ao deletar manutenção. Tente novamente.")
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingMaintenance(null)
    fetchMaintenances()
  }

  if (loading && maintenances.length === 0) {
    return <LoadingCard />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Histórico de Manutenções</h2>
          <p className="text-muted-foreground">
            Registre e acompanhe as manutenções dos seus veículos
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Manutenção
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
        <MaintenanceForm
          maintenance={editingMaintenance}
          vehicles={vehicles}
          onClose={handleFormClose}
        />
      )}

      {maintenances.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="Nenhuma manutenção registrada"
          description="Adicione sua primeira manutenção para começar a acompanhar o histórico."
        />
      ) : (
        <div className="space-y-4">
          {maintenances.map((maintenance) => (
            <Card key={maintenance.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {maintenanceTypeLabels[maintenance.type as keyof typeof maintenanceTypeLabels] || maintenance.type}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        - {maintenance.vehicle.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(maintenance.date)}
                    </p>
                    {maintenance.description && (
                      <p className="text-sm mb-2">{maintenance.description}</p>
                    )}
                    <div className="flex gap-4 text-sm">
                      {maintenance.cost && (
                        <span className="font-medium">
                          Custo: {formatCurrency(maintenance.cost, maintenance.currency)}
                        </span>
                      )}
                      {maintenance.mileage && (
                        <span className="text-muted-foreground">
                          Quilometragem: {maintenance.mileage.toFixed(0)} km
                        </span>
                      )}
                    </div>
                    {maintenance.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {maintenance.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(maintenance)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(maintenance.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}




