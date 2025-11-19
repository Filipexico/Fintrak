"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { usageLogFormSchema, type UsageLogInput } from "@/lib/validations/usage"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiPost, apiPut } from "@/lib/utils/api"
import { X, Navigation } from "lucide-react"
import { dateToInputFormat } from "@/lib/utils/format"
import { GPSDistanceCapture } from "./GPSDistanceCapture"

type UsageFormProps = {
  log?: {
    id: string
    vehicleId: string
    date: string | Date
    distanceKm: number
    fuelLiters: number | null
    energyKwh: number | null
    notes: string | null
  } | null
  vehicles: Array<{ id: string; name: string; fuelType: string | null }>
  onClose: () => void
}

export function UsageForm({ log, vehicles, onClose }: UsageFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showGPS, setShowGPS] = useState(false)
  const { success, error: showError } = useToastContext()

  const isEditing = !!log

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UsageLogInput>({
    resolver: zodResolver(usageLogFormSchema),
        defaultValues: log
      ? {
          vehicleId: log.vehicleId,
          date: dateToInputFormat(log.date),
          distanceKm: log.distanceKm,
          fuelLiters: log.fuelLiters || undefined,
          energyKwh: log.energyKwh || undefined,
          notes: log.notes || undefined,
        }
      : {
          date: dateToInputFormat(new Date()),
        },
  })

  const distanceKm = watch("distanceKm")
  const fuelLiters = watch("fuelLiters")
  const energyKwh = watch("energyKwh")
  const vehicleId = watch("vehicleId")

  // Determinar se o veículo é elétrico
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId)
  const isElectric = selectedVehicle?.fuelType === "electric"

  const calculateKmPerLiter = (): number | null => {
    if (!distanceKm || !fuelLiters || fuelLiters === 0) return null
    return Number((distanceKm / fuelLiters).toFixed(2))
  }

  const calculateKmPerKwh = (): number | null => {
    if (!distanceKm || !energyKwh || energyKwh === 0) return null
    return Number((distanceKm / energyKwh).toFixed(2))
  }

  const onSubmit = async (data: UsageLogInput) => {
    setIsLoading(true)
    setError(null)

    try {
      if (isEditing) {
        const result = await apiPut(`/api/usage/${log.id}`, data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
        } else {
          success("Registro atualizado com sucesso!")
          onClose()
        }
      } else {
        const result = await apiPost("/api/usage", data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
        } else {
          success("Registro criado com sucesso!")
          onClose()
        }
      }
    } catch (err) {
      const errorMsg = "Erro ao salvar registro. Tente novamente."
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const kmPerLiter = calculateKmPerLiter()
  const kmPerKwh = calculateKmPerKwh()

  const handleGPSDistance = (distance: number) => {
    setValue("distanceKm", distance)
    setShowGPS(false)
    success(`Distância de ${distance.toFixed(2)} km capturada via GPS`)
  }

  if (showGPS) {
    return (
      <GPSDistanceCapture
        onDistanceCaptured={handleGPSDistance}
        onClose={() => setShowGPS(false)}
      />
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditing ? "Editar Registro" : "Novo Registro de Uso"}</CardTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">Veículo *</Label>
              <select
                id="vehicleId"
                {...register("vehicleId")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <p className="text-sm text-destructive">{errors.vehicleId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="distanceKm">Distância (km) *</Label>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGPS(true)}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    GPS
                  </Button>
                )}
              </div>
              <Input
                id="distanceKm"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("distanceKm", { valueAsNumber: true })}
              />
              {errors.distanceKm && (
                <p className="text-sm text-destructive">{errors.distanceKm.message}</p>
              )}
            </div>

            {isElectric ? (
              <div className="space-y-2">
                <Label htmlFor="energyKwh">Energia (kWh)</Label>
                <Input
                  id="energyKwh"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("energyKwh", { valueAsNumber: true })}
                />
                {errors.energyKwh && (
                  <p className="text-sm text-destructive">{errors.energyKwh.message}</p>
                )}
                {kmPerKwh && (
                  <p className="text-xs text-muted-foreground">
                    Eficiência: {kmPerKwh} km/kWh
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="fuelLiters">Combustível (L)</Label>
                <Input
                  id="fuelLiters"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("fuelLiters", { valueAsNumber: true })}
                />
                {errors.fuelLiters && (
                  <p className="text-sm text-destructive">{errors.fuelLiters.message}</p>
                )}
                {kmPerLiter && (
                  <p className="text-xs text-muted-foreground">
                    Eficiência: {kmPerLiter} km/L
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Observações sobre o uso..."
              {...register("notes")}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
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

