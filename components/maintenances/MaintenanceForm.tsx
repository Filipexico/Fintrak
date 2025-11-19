"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { maintenanceSchema, type MaintenanceInput } from "@/lib/validations/maintenance"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiPost, apiPut } from "@/lib/utils/api"
import { X } from "lucide-react"
import { dateToInputFormat } from "@/lib/utils/format"
import { MAINTENANCE_TYPES, maintenanceTypeLabels } from "@/lib/constants"

type MaintenanceFormProps = {
  maintenance?: {
    id: string
    vehicleId: string
    date: string | Date
    type: string
    description: string | null
    cost: number | null
    currency: string
    mileage: number | null
    notes: string | null
  } | null
  vehicles: Array<{ id: string; name: string }>
  onClose: () => void
}

export function MaintenanceForm({ maintenance, vehicles, onClose }: MaintenanceFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { success, error: showError } = useToastContext()

  const isEditing = !!maintenance

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceInput>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: maintenance
      ? {
          vehicleId: maintenance.vehicleId,
          date: dateToInputFormat(maintenance.date),
          type: maintenance.type,
          description: maintenance.description || undefined,
          cost: maintenance.cost || undefined,
          currency: maintenance.currency,
          mileage: maintenance.mileage || undefined,
          notes: maintenance.notes || undefined,
        }
      : {
          currency: "BRL",
        },
  })

  const onSubmit = async (data: MaintenanceInput) => {
    setIsLoading(true)
    setError(null)

    try {
      if (isEditing) {
        const result = await apiPut(`/api/maintenances/${maintenance.id}`, data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
        } else {
          success("Manutenção atualizada com sucesso!")
          onClose()
        }
      } else {
        const result = await apiPost("/api/maintenances", data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
        } else {
          success("Manutenção criada com sucesso!")
          onClose()
        }
      }
    } catch (err) {
      const errorMsg = "Erro ao salvar manutenção. Tente novamente."
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditing ? "Editar Manutenção" : "Nova Manutenção"}</CardTitle>
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

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Manutenção *</Label>
            <select
              id="type"
              {...register("type")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {MAINTENANCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {maintenanceTypeLabels[type]}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Descreva a manutenção realizada..."
              {...register("description")}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Custo</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("cost", { valueAsNumber: true })}
              />
              {errors.cost && (
                <p className="text-sm text-destructive">{errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Input
                id="currency"
                type="text"
                maxLength={3}
                placeholder="BRL"
                {...register("currency")}
              />
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Quilometragem (km)</Label>
              <Input
                id="mileage"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                {...register("mileage", { valueAsNumber: true })}
              />
              {errors.mileage && (
                <p className="text-sm text-destructive">{errors.mileage.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Observações adicionais..."
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



