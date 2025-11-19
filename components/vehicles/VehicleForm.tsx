"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { vehicleSchema, type VehicleInput } from "@/lib/validations/vehicle"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiPost, apiPut } from "@/lib/utils/api"
import { X } from "lucide-react"
import { VEHICLE_TYPES, FUEL_TYPES } from "@/lib/constants"

type VehicleFormProps = {
  vehicle?: {
    id: string
    name: string
    type: string | null
    plate: string | null
    fuelType: string | null
    notes: string | null
    isActive: boolean
  } | null
  onClose: () => void
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

export function VehicleForm({ vehicle, onClose }: VehicleFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { success, error: showError } = useToastContext()

  const isEditing = !!vehicle

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          name: vehicle.name,
          type: vehicle.type || undefined,
          plate: vehicle.plate || undefined,
          fuelType: vehicle.fuelType || undefined,
          notes: vehicle.notes || undefined,
          isActive: vehicle.isActive,
        }
      : {
          isActive: true,
        },
  })

  const onSubmit = async (data: VehicleInput) => {
    setIsLoading(true)
    setError(null)

    try {
      if (isEditing) {
        const result = await apiPut(`/api/vehicles/${vehicle.id}`, data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
        } else {
          success("Veículo atualizado com sucesso!")
          onClose()
        }
      } else {
        const result = await apiPost("/api/vehicles", data)
        if (result.error) {
          // Check if it's a plan limit error
          if (result.details && typeof result.details === "object" && "upgradeRequired" in result.details) {
            const details = result.details as { upgradeRequired: boolean; plan: string; current: number; max: number }
            const errorMsg = `Limite de veículos atingido no plano ${details.plan}. Você tem ${details.current} de ${details.max} veículos. Faça upgrade para adicionar mais veículos.`
            setError(errorMsg)
            showError(errorMsg)
          } else {
            setError(result.error)
            showError(result.error)
          }
        } else {
          success("Veículo criado com sucesso!")
          onClose()
        }
      }
    } catch (err) {
      const errorMsg = "Erro ao salvar veículo. Tente novamente."
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditing ? "Editar Veículo" : "Novo Veículo"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Veículo *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Honda NX500"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                {...register("type")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {vehicleTypeLabels[type] || type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Tipo de Combustível</Label>
              <select
                id="fuelType"
                {...register("fuelType")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {FUEL_TYPES.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuelTypeLabels[fuel] || fuel}
                  </option>
                ))}
              </select>
              {errors.fuelType && (
                <p className="text-sm text-destructive">{errors.fuelType.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plate">Placa</Label>
            <Input
              id="plate"
              type="text"
              placeholder="ABC-1234"
              {...register("plate")}
            />
            {errors.plate && (
              <p className="text-sm text-destructive">{errors.plate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Informações adicionais sobre o veículo..."
              {...register("notes")}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="text-sm font-normal">
              Veículo ativo
            </Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

