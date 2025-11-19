"use client"

import { useState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createExpenseSchema, updateExpenseSchema } from "@/lib/validations/expense"
import { EXPENSE_CATEGORIES } from "@/lib/constants"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ExpenseFormData, ExpenseListItem } from "@/types"
import { dateToInputFormat } from "@/lib/utils/format"
import { apiPost, apiPut } from "@/lib/utils/api"

const categoryLabels: Record<string, string> = {
  fuel: "Combustível",
  insurance: "Seguro",
  phone: "Telefone",
  maintenance: "Manutenção",
  food: "Alimentação",
  parking: "Estacionamento",
  tolls: "Pedágio",
  other: "Outros",
}

type ExpenseFormProps = {
  expense?: ExpenseListItem | null
  onClose: () => void
}

export function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { success, error: showError } = useToastContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expense ? updateExpenseSchema : createExpenseSchema),
    defaultValues: expense
      ? {
          category: expense.category,
          amount: expense.amount,
          currency: expense.currency,
          date: expense.date ? dateToInputFormat(expense.date) : dateToInputFormat(new Date()),
          description: expense.description || "",
        }
      : {
          category: "fuel",
          amount: 0,
          currency: "BRL",
          date: dateToInputFormat(new Date()),
          description: "",
        },
  })

  useEffect(() => {
    if (expense) {
      reset({
        category: expense.category,
        amount: expense.amount,
        currency: expense.currency,
        date: expense.date ? dateToInputFormat(expense.date) : dateToInputFormat(new Date()),
        description: expense.description || "",
      })
    }
  }, [expense, reset])

  const onSubmit: SubmitHandler<ExpenseFormData> = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        ...data,
        amount: parseFloat(String(data.amount)),
      }

      const result = expense
        ? await apiPut<ExpenseListItem>(`/api/expenses/${expense.id}`, payload)
        : await apiPost<ExpenseListItem>("/api/expenses", payload)

      if (result.error) {
        const errorMsg = result.error || "Erro ao salvar despesa"
        setError(errorMsg)
        showError(errorMsg)
        setIsLoading(false)
        return
      }

      success(expense ? "Despesa atualizada com sucesso" : "Despesa criada com sucesso")
      onClose()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao salvar despesa. Tente novamente."
      setError(errorMsg)
      showError(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{expense ? "Editar Despesa" : "Nova Despesa"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select id="category" {...register("category")}>
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category] || category}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message as string}
                </p>
              )}
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
                placeholder="Ex: Abastecimento no posto X"
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

