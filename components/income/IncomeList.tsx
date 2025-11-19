"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingCard } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Plus, Edit, Trash2, DollarSign } from "lucide-react"
import { IncomeForm } from "./IncomeForm"
import type { IncomeListItem } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { apiFetch, apiDelete } from "@/lib/utils/api"
import { logger } from "@/lib/logger"

export function IncomeList() {
  const [incomes, setIncomes] = useState<IncomeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<IncomeListItem | null>(null)
  const { success, error: showError } = useToastContext()

  const fetchIncomes = async () => {
    try {
      const result = await apiFetch<IncomeListItem[]>("/api/income")
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        setIncomes(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar receitas", error instanceof Error ? error : undefined)
      showError("Erro ao carregar receitas. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta receita?")) {
      return
    }

    try {
      const result = await apiDelete(`/api/income/${id}`)
      if (result.error) {
        showError(result.error)
      } else {
        success("Receita deletada com sucesso")
        fetchIncomes()
      }
    } catch (error) {
      logger.error("Erro ao deletar receita", error instanceof Error ? error : undefined)
      showError("Erro ao deletar receita. Tente novamente.")
    }
  }

  const handleEdit = (income: IncomeListItem) => {
    setEditingIncome(income)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingIncome(null)
    fetchIncomes()
  }

  if (loading) {
    return <LoadingCard />
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Receita
        </Button>
      </div>

      {showForm && (
        <IncomeForm income={editingIncome} onClose={handleFormClose} />
      )}

      <div className="space-y-4">
        {incomes.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="Nenhuma receita cadastrada"
            description="Comece registrando sua primeira receita de entrega."
            action={{
              label: "Nova Receita",
              onClick: () => setShowForm(true),
            }}
          />
        ) : (
          incomes.map((income) => (
            <Card key={income.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {formatCurrency(income.amount, income.currency)}
                      </h3>
                      {income.platform && (
                        <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                          {income.platform.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(income.date)}
                    </p>
                    {income.description && (
                      <p className="mt-1 text-sm">{income.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(income)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(income.id)}
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

