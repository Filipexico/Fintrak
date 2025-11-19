"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingCard } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Plus, Edit, Trash2, Car } from "lucide-react"
import { VehicleForm } from "./VehicleForm"
import { CurrentVehicleSelector } from "./CurrentVehicleSelector"
import { apiFetch, apiDelete } from "@/lib/utils/api"
import { logger } from "@/lib/logger"
import { VEHICLE_TYPES, FUEL_TYPES } from "@/lib/constants"

interface Vehicle {
  id: string
  name: string
  type: string | null
  plate: string | null
  fuelType: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const vehicleTypeLabels: Record<string, string> = {
  motorbike: "Moto",
  car: "Carro",
  bike: "Bicicleta",
  scooter: "Scooter",
  other: "Outro",
}

const fuelTypeLabels: Record<string, string> = {
  gasoline: "Gasolina",
  diesel: "Diesel",
  ethanol: "Etanol",
  electric: "Elétrico",
  hybrid: "Híbrido",
  other: "Outro",
}

export function VehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const { success, error: showError } = useToastContext()

  const fetchVehicles = async () => {
    try {
      const result = await apiFetch<Vehicle[]>("/api/vehicles?includeInactive=true")
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        setVehicles(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar veículos", error instanceof Error ? error : undefined)
      showError("Erro ao carregar veículos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja desativar este veículo?")) {
      return
    }

    try {
      const result = await apiDelete(`/api/vehicles/${id}`)
      if (result.error) {
        // Check if it's a plan limit error
        if (result.details && typeof result.details === "object" && "upgradeRequired" in result.details) {
          const details = result.details as { upgradeRequired: boolean; plan: string; current: number; max: number }
          showError(
            `Limite de veículos atingido no plano ${details.plan}. Faça upgrade para adicionar mais veículos.`
          )
        } else {
          showError(result.error)
        }
      } else {
        success("Veículo desativado com sucesso")
        fetchVehicles()
      }
    } catch (error) {
      logger.error("Erro ao desativar veículo", error instanceof Error ? error : undefined)
      showError("Erro ao desativar veículo. Tente novamente.")
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingVehicle(null)
    fetchVehicles()
  }

  if (loading) {
    return <LoadingCard />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meus Veículos</h2>
          <p className="text-muted-foreground">
            Gerencie seus veículos e registre o uso diário
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CurrentVehicleSelector />
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Veículo
          </Button>
        </div>
      </div>

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={handleFormClose}
        />
      )}

      {vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="Nenhum veículo cadastrado"
          description="Adicione seu primeiro veículo para começar a registrar distâncias e consumo de combustível."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className={!vehicle.isActive ? "opacity-60" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                      {/* TODO: Mostrar indicador de veículo atual quando implementado */}
                    </div>
                    {!vehicle.isActive && (
                      <span className="text-xs text-muted-foreground">Desativado</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {vehicle.type && (
                    <div>
                      <span className="text-muted-foreground">Tipo: </span>
                      <span>{vehicleTypeLabels[vehicle.type] || vehicle.type}</span>
                    </div>
                  )}
                  {vehicle.plate && (
                    <div>
                      <span className="text-muted-foreground">Placa: </span>
                      <span>{vehicle.plate}</span>
                    </div>
                  )}
                  {vehicle.fuelType && (
                    <div>
                      <span className="text-muted-foreground">Combustível: </span>
                      <span>{fuelTypeLabels[vehicle.fuelType] || vehicle.fuelType}</span>
                    </div>
                  )}
                  {vehicle.notes && (
                    <div>
                      <span className="text-muted-foreground">Notas: </span>
                      <span className="text-xs">{vehicle.notes}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

