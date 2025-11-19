"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToastContext } from "@/components/providers/ToastProvider"
import { apiFetch, apiPost } from "@/lib/utils/api"
import { logger } from "@/lib/logger"
import { Car } from "lucide-react"

interface Vehicle {
  id: string
  name: string
}

export function CurrentVehicleSelector() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToastContext()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [vehiclesRes, currentRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/user/current-vehicle"),
      ])

      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        setVehicles(vehiclesData)
      }

      if (currentRes.ok) {
        const currentData = await currentRes.json()
        setCurrentVehicleId(currentData.currentVehicleId)
      }
    } catch (error) {
      logger.error("Erro ao carregar veículos", error instanceof Error ? error : undefined)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = async (vehicleId: string) => {
    try {
      const result = await apiPost("/api/user/current-vehicle", { vehicleId })
      if (result.error) {
        showError(result.error)
      } else {
        setCurrentVehicleId(vehicleId)
        success("Veículo atual atualizado com sucesso")
      }
    } catch (error) {
      logger.error("Erro ao atualizar veículo atual", error instanceof Error ? error : undefined)
      showError("Erro ao atualizar veículo atual")
    }
  }

  if (loading || vehicles.length === 0) {
    return null
  }

  const currentVehicle = vehicles.find((v) => v.id === currentVehicleId)

  return (
    <div className="flex items-center gap-2">
      <Car className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Veículo atual:</span>
      <select
        value={currentVehicleId || ""}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-md border border-input bg-background px-2 py-1 text-sm"
      >
        <option value="">Nenhum</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.name}
          </option>
        ))}
      </select>
    </div>
  )
}



