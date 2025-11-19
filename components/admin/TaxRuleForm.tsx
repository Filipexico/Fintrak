"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TaxRule = {
  id: string
  country: string
  displayName: string
  percentage: number
  isActive: boolean
}

type TaxRuleFormProps = {
  taxRule?: TaxRule | null
  onClose: () => void
}

const taxRuleSchema = z.object({
  country: z.string().length(2, "Código do país deve ter 2 caracteres"),
  displayName: z.string().min(1, "Nome é obrigatório"),
  percentage: z.number().min(0).max(1, "Porcentagem deve estar entre 0 e 1"),
  isActive: z.boolean().optional().default(true),
})

export function TaxRuleForm({ taxRule, onClose }: TaxRuleFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(taxRuleSchema),
    defaultValues: taxRule
      ? {
          ...taxRule,
          percentage: taxRule.percentage,
        }
      : {
          country: "",
          displayName: "",
          percentage: 0.15,
          isActive: true,
        },
  })

  useEffect(() => {
    if (taxRule) {
      reset({
        country: taxRule.country,
        displayName: taxRule.displayName,
        percentage: taxRule.percentage,
        isActive: taxRule.isActive,
      })
    }
  }, [taxRule, reset])

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = taxRule
        ? `/api/admin/tax-rules/${taxRule.id}`
        : "/api/admin/tax-rules"
      const method = taxRule ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          percentage: parseFloat(data.percentage),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Erro ao salvar regra fiscal")
        setIsLoading(false)
        return
      }

      onClose()
    } catch (err) {
      setError("Erro ao salvar regra fiscal. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {taxRule ? "Editar Regra Fiscal" : "Nova Regra Fiscal"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="country">Código do País (ISO)</Label>
              <Input
                id="country"
                placeholder="BR"
                maxLength={2}
                disabled={!!taxRule}
                {...register("country")}
              />
              {errors.country && (
                <p className="text-sm text-destructive">
                  {errors.country.message as string}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Ex: BR, US, CA, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Nome do País</Label>
              <Input
                id="displayName"
                placeholder="Brasil"
                {...register("displayName")}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive">
                  {errors.displayName.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Porcentagem (0 a 1)</Label>
              <Input
                id="percentage"
                type="number"
                step="0.0001"
                min="0"
                max="1"
                placeholder="0.15"
                {...register("percentage", { valueAsNumber: true })}
              />
              {errors.percentage && (
                <p className="text-sm text-destructive">
                  {errors.percentage.message as string}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Ex: 0.15 = 15%, 0.20 = 20%
              </p>
            </div>

            {taxRule && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive">Ativa</Label>
              </div>
            )}

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



