"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import { TaxRuleForm } from "./TaxRuleForm"

type TaxRule = {
  id: string
  country: string
  displayName: string
  percentage: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function TaxRulesList() {
  const [taxRules, setTaxRules] = useState<TaxRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null)

  const fetchTaxRules = async () => {
    try {
      const response = await fetch("/api/admin/tax-rules")
      if (response.ok) {
        const data = await response.json()
        setTaxRules(data)
      }
    } catch (error) {
      console.error("Erro ao carregar tax rules:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTaxRules()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta regra fiscal?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tax-rules/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchTaxRules()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao deletar regra fiscal")
      }
    } catch (error) {
      console.error("Erro ao deletar regra fiscal:", error)
      alert("Erro ao deletar regra fiscal")
    }
  }

  const handleEdit = (rule: TaxRule) => {
    setEditingRule(rule)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingRule(null)
    fetchTaxRules()
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Regra Fiscal
        </Button>
      </div>

      {showForm && (
        <TaxRuleForm taxRule={editingRule} onClose={handleFormClose} />
      )}

      <div className="space-y-2">
        {taxRules.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma regra fiscal cadastrada.
            </CardContent>
          </Card>
        ) : (
          taxRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rule.displayName}</h3>
                      <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                        {rule.country}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          rule.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rule.isActive ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(Number(rule.percentage) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(rule.id)}
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



