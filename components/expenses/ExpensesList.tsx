"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingCard } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Plus, Edit, Trash2, Receipt } from "lucide-react"
import { ExpenseForm } from "./ExpenseForm"
import type { ExpenseListItem } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { apiFetch, apiDelete } from "@/lib/utils/api"
import { logger } from "@/lib/logger"

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

export function ExpensesList() {
  const [expenses, setExpenses] = useState<ExpenseListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseListItem | null>(null)
  const { success, error: showError } = useToastContext()

  const fetchExpenses = async () => {
    try {
      const result = await apiFetch<ExpenseListItem[]>("/api/expenses")
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        setExpenses(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar despesas", error instanceof Error ? error : undefined)
      showError("Erro ao carregar despesas. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta despesa?")) {
      return
    }

    try {
      const result = await apiDelete(`/api/expenses/${id}`)
      if (result.error) {
        showError(result.error)
      } else {
        success("Despesa deletada com sucesso")
        fetchExpenses()
      }
    } catch (error) {
      logger.error("Erro ao deletar despesa", error instanceof Error ? error : undefined)
      showError("Erro ao deletar despesa. Tente novamente.")
    }
  }

  const handleEdit = (expense: ExpenseListItem) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingExpense(null)
    fetchExpenses()
  }

  if (loading) {
    return <LoadingCard />
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Despesa
        </Button>
      </div>

      {showForm && (
        <ExpenseForm expense={editingExpense} onClose={handleFormClose} />
      )}

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhuma despesa cadastrada"
            description="Comece registrando suas despesas de trabalho."
            action={{
              label: "Nova Despesa",
              onClick: () => setShowForm(true),
            }}
          />
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {formatCurrency(expense.amount, expense.currency)}
                      </h3>
                      <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                        {categoryLabels[expense.category] || expense.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.date)}
                    </p>
                    {expense.description && (
                      <p className="mt-1 text-sm">{expense.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

