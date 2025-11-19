"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, Search, Plus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToastContext } from "@/components/providers/ToastProvider"
import { apiFetch, apiDelete } from "@/lib/utils/api"
import { logger } from "@/lib/logger"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { SubscriptionForm } from "./SubscriptionForm"

type Subscription = {
  id: string
  userId: string
  planId: string
  status: "active" | "canceled" | "trial" | "overdue"
  startDate: string
  endDate: string | null
  nextBillingDate: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  plan: {
    id: string
    name: string
    displayName: string
    priceMonthly: number
  }
}

export function SubscriptionsList() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterPlan, setFilterPlan] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<Array<{ id: string; name: string; displayName: string }>>([])
  const { success, error: showError } = useToastContext()

  const fetchPlans = async () => {
    try {
      const result = await apiFetch<Array<{ id: string; name: string; displayName: string }>>(
        "/api/admin/plans"
      )
      if (result.data) {
        setPlans(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar planos", error instanceof Error ? error : undefined)
    }
  }

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.set("status", filterStatus)
      if (filterPlan) params.set("planId", filterPlan)

      const result = await apiFetch<Subscription[]>(
        `/api/admin/subscriptions?${params}`
      )
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        // Filtrar por busca (nome/email do usuário)
        let filtered = result.data
        if (search) {
          const searchLower = search.toLowerCase()
          filtered = result.data.filter(
            (sub) =>
              sub.user.name.toLowerCase().includes(searchLower) ||
              sub.user.email.toLowerCase().includes(searchLower)
          )
        }
        setSubscriptions(filtered)
      }
    } catch (error) {
      logger.error("Erro ao carregar assinaturas", error instanceof Error ? error : undefined)
      showError("Erro ao carregar assinaturas. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  useEffect(() => {
    fetchSubscriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterPlan])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchSubscriptions()
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleDelete = async (subscriptionId: string) => {
    if (!confirm("Tem certeza que deseja deletar esta assinatura?")) {
      return
    }

    try {
      const result = await apiDelete(`/api/admin/subscriptions/${subscriptionId}`)
      if (result.error) {
        showError(result.error)
      } else {
        success("Assinatura deletada com sucesso")
        fetchSubscriptions()
      }
    } catch (error) {
      logger.error("Erro ao deletar assinatura", error instanceof Error ? error : undefined)
      showError("Erro ao deletar assinatura")
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      canceled: "bg-gray-100 text-gray-800",
      trial: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
    }
    const labels = {
      active: "Ativa",
      canceled: "Cancelada",
      trial: "Trial",
      overdue: "Em Débito",
    }
    return (
      <span className={`rounded-full px-2 py-1 text-xs ${styles[status as keyof typeof styles] || styles.canceled}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus || ""}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos os status</option>
          <option value="active">Ativa</option>
          <option value="trial">Trial</option>
          <option value="overdue">Em Débito</option>
          <option value="canceled">Cancelada</option>
        </select>
        <select
          value={filterPlan || ""}
          onChange={(e) => setFilterPlan(e.target.value || null)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos os planos</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.displayName}
            </option>
          ))}
        </select>
        <Button onClick={() => {
          setEditingSubscription(null)
          setShowForm(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Assinatura
        </Button>
      </div>

      {showForm && (
        <SubscriptionForm
          subscription={editingSubscription}
          plans={plans}
          onClose={() => {
            setShowForm(false)
            setEditingSubscription(null)
            fetchSubscriptions()
          }}
        />
      )}

      <div className="space-y-2">
        {subscriptions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma assinatura encontrada.
            </CardContent>
          </Card>
        ) : (
          subscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{subscription.user.name}</h3>
                      {getStatusBadge(subscription.status)}
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        {subscription.plan.displayName}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{subscription.user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Início: {formatDate(subscription.startDate)} •{" "}
                      {formatCurrency(subscription.plan.priceMonthly, "BRL")}/mês
                    </p>
                    {subscription.nextBillingDate && (
                      <p className="text-xs text-muted-foreground">
                        Próxima cobrança: {formatDate(subscription.nextBillingDate)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSubscription(subscription)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(subscription.id)}
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



