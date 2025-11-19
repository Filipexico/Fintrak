"use client"

import { useState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createIncomeSchema, updateIncomeSchema } from "@/lib/validations/income"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { IncomeFormData, IncomeListItem, PlatformListItem } from "@/types"
import { dateToInputFormat } from "@/lib/utils/format"
import { apiPost, apiPut } from "@/lib/utils/api"

type IncomeFormProps = {
  income?: IncomeListItem | null
  onClose: () => void
}

export function IncomeForm({ income, onClose }: IncomeFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [platforms, setPlatforms] = useState<PlatformListItem[]>([])
  const { success, error: showError } = useToastContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IncomeFormData>({
    resolver: zodResolver(income ? updateIncomeSchema : createIncomeSchema),
    defaultValues: income
      ? {
          platformId: income.platformId || null,
          amount: income.amount,
          currency: income.currency,
          date: income.date ? dateToInputFormat(income.date) : dateToInputFormat(new Date()),
          description: income.description || "",
        }
      : {
          platformId: null,
          amount: 0,
          currency: "BRL",
          date: dateToInputFormat(new Date()),
          description: "",
        },
  })

  useEffect(() => {
    // Carregar plataformas
    fetch("/api/platforms")
      .then((res) => res.json())
      .then((data: PlatformListItem[]) => {
        setPlatforms(data.filter((p) => p.isActive))
      })
      .catch(() => {
        showError("Erro ao carregar plataformas")
      })

    if (income) {
      reset({
        platformId: income.platformId || null,
        amount: income.amount,
        currency: income.currency,
        date: income.date ? dateToInputFormat(income.date) : dateToInputFormat(new Date()),
        description: income.description || "",
      })
    }
  }, [income, reset, showError])

  const onSubmit: SubmitHandler<IncomeFormData> = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        ...data,
        amount: parseFloat(String(data.amount)),
        platformId: data.platformId || null,
      }

      const result = income
        ? await apiPut<IncomeListItem>(`/api/income/${income.id}`, payload)
        : await apiPost<IncomeListItem>("/api/income", payload)

      if (result.error) {
        const errorMsg = result.error || "Erro ao salvar receita"
        setError(errorMsg)
        showError(errorMsg)
        setIsLoading(false)
        return
      }

      success(income ? "Receita atualizada com sucesso" : "Receita criada com sucesso")
      onClose()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao salvar receita. Tente novamente."
      setError(errorMsg)
      showError(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{income ? "Editar Receita" : "Nova Receita"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="platformId">Plataforma (opcional)</Label>
              <Select id="platformId" {...register("platformId")}>
                <option value="">Nenhuma</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select id="currency" {...register("currency")}>
                <option value="BRL">BRL - Real Brasileiro</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Ex: Entrega no centro"
                {...register("description")}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

