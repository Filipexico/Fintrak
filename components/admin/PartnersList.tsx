"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, Ban, CheckCircle, Trash2, Search, Plus, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToastContext } from "@/components/providers/ToastProvider"
import { apiFetch, apiDelete, apiPost } from "@/lib/utils/api"
import { logger } from "@/lib/logger"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { CreateUserForm } from "./CreateUserForm"

type Partner = {
  id: string
  email: string
  name: string
  country: string
  currency: string
  role: string
  isActive: boolean
  createdAt: string
  subscriptions: Array<{
    plan: {
      name: string
      displayName: string
      priceMonthly: number
    }
  }>
  _count: {
    incomes: number
    expenses: number
    platforms: number
    subscriptions: number
    payments: number
  }
}

export function PartnersList() {
  const router = useRouter()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterActive, setFilterActive] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { success, error: showError } = useToastContext()

  const fetchPartners = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (filterActive !== null) params.set("isActive", filterActive)

      const result = await apiFetch<Partner[]>(`/api/admin/users?${params}`)
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        setPartners(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar parceiros", error instanceof Error ? error : undefined)
      showError("Erro ao carregar parceiros. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterActive])

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        success(currentStatus ? "Usuário desativado" : "Usuário ativado")
        fetchPartners()
      } else {
        const error = await response.json()
        showError(error.error || "Erro ao atualizar usuário")
      }
    } catch (error) {
      logger.error("Erro ao atualizar usuário", error instanceof Error ? error : undefined)
      showError("Erro ao atualizar usuário")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      const result = await apiDelete(`/api/admin/users/${userId}`)
      if (result.error) {
        showError(result.error)
      } else {
        success("Usuário deletado com sucesso")
        fetchPartners()
      }
    } catch (error) {
      logger.error("Erro ao deletar usuário", error instanceof Error ? error : undefined)
      showError("Erro ao deletar usuário")
    }
  }

  const getCurrentPlan = (partner: Partner) => {
    if (partner.subscriptions && partner.subscriptions.length > 0) {
      return partner.subscriptions[0].plan
    }
    return null
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterActive || ""}
          onChange={(e) => setFilterActive(e.target.value || null)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {showCreateForm && (
        <CreateUserForm
          onClose={() => {
            setShowCreateForm(false)
            fetchPartners()
          }}
        />
      )}

      <div className="space-y-2">
        {partners.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum parceiro encontrado.
            </CardContent>
          </Card>
        ) : (
          partners.map((partner) => {
            const currentPlan = getCurrentPlan(partner)
            return (
              <Card key={partner.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{partner.name}</h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            partner.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {partner.isActive ? "Ativo" : "Inativo"}
                        </span>
                        {partner.role === "ADMIN" && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            Admin
                          </span>
                        )}
                        {currentPlan && (
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                            {currentPlan.displayName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{partner.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {partner.country} • {partner.currency} • Cadastrado em {formatDate(partner.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {partner._count.incomes} receitas • {partner._count.expenses} despesas • {partner._count.subscriptions} assinaturas
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/partners/${partner.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(partner.id, partner.isActive)}
                      >
                        {partner.isActive ? (
                          <Ban className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(partner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}



