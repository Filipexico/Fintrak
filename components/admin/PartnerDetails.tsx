"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/utils/api"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { logger } from "@/lib/logger"
import { useToastContext } from "@/components/providers/ToastProvider"
import { UserDashboardView } from "./UserDashboardView"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Receipt, User } from "lucide-react"

type PartnerData = {
  id: string
  name: string
  email: string
  country: string
  currency: string
  role: string
  isActive: boolean
  createdAt: string
}

type Subscription = {
  id: string
  planId: string
  status: string
  startDate: string
  endDate: string | null
  nextBillingDate: string | null
  plan: {
    name: string
    displayName: string
    priceMonthly: number
  }
}

type Payment = {
  id: string
  amount: number
  currency: string
  paymentDate: string
  paymentMethod: string
  status: string
  description: string | null
}

export function PartnerDetails({ userId }: { userId: string }) {
  const [partner, setPartner] = useState<PartnerData | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const { error: showError } = useToastContext()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Buscar dados do parceiro
        const partnerResult = await apiFetch<PartnerData>(`/api/admin/users/${userId}`)
        if (partnerResult.data) {
          setPartner(partnerResult.data)
        }

        // Buscar assinaturas
        const subsResult = await apiFetch<Subscription[]>(
          `/api/admin/subscriptions?userId=${userId}`
        )
        if (subsResult.data) {
          setSubscriptions(subsResult.data)
        }

        // Buscar pagamentos
        const paymentsResult = await apiFetch<Payment[]>(
          `/api/admin/payments?userId=${userId}`
        )
        if (paymentsResult.data) {
          setPayments(paymentsResult.data)
        }
      } catch (error) {
        logger.error("Erro ao carregar detalhes do parceiro", error instanceof Error ? error : undefined)
        showError("Erro ao carregar dados. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>
  }

  if (!partner) {
    return <div className="text-center py-8 text-destructive">Parceiro não encontrado</div>
  }

  const getStatusBadge = (status: string, type: "subscription" | "payment") => {
    if (type === "subscription") {
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
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            styles[status as keyof typeof styles] || styles.canceled
          }`}
        >
          {labels[status as keyof typeof labels] || status}
        </span>
      )
    } else {
      const styles = {
        paid: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
        refunded: "bg-yellow-100 text-yellow-800",
        pending: "bg-blue-100 text-blue-800",
      }
      const labels = {
        paid: "Pago",
        failed: "Falhou",
        refunded: "Reembolsado",
        pending: "Pendente",
      }
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            styles[status as keyof typeof styles] || styles.pending
          }`}
        >
          {labels[status as keyof typeof labels] || status}
        </span>
      )
    }
  }

  const activeSubscription = subscriptions.find((sub) => sub.status === "active")

  return (
    <div className="space-y-6">
      {/* Informações do parceiro */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Parceiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Nome</p>
            <p className="font-medium">{partner.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{partner.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">País</p>
              <p className="font-medium">{partner.country}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moeda</p>
              <p className="font-medium">{partner.currency}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs ${
                partner.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {partner.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cadastrado em</p>
            <p className="font-medium">{formatDate(partner.createdAt)}</p>
          </div>
          {activeSubscription && (
            <div>
              <p className="text-sm text-muted-foreground">Plano Atual</p>
              <p className="font-medium">
                {activeSubscription.plan.displayName} -{" "}
                {formatCurrency(activeSubscription.plan.priceMonthly, partner.currency)}/mês
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <CreditCard className="mr-2 h-4 w-4" />
            Assinaturas ({subscriptions.length})
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Receipt className="mr-2 h-4 w-4" />
            Pagamentos ({payments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <UserDashboardView userId={userId} currency={partner.currency} />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
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
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{subscription.plan.displayName}</h3>
                        {getStatusBadge(subscription.status, "subscription")}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatCurrency(subscription.plan.priceMonthly, partner.currency)}/mês
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Início: {formatDate(subscription.startDate)}
                        {subscription.endDate && ` • Término: ${formatDate(subscription.endDate)}`}
                      </p>
                      {subscription.nextBillingDate && (
                        <p className="text-xs text-muted-foreground">
                          Próxima cobrança: {formatDate(subscription.nextBillingDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {payments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum pagamento encontrado.
              </CardContent>
            </Card>
          ) : (
            payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {formatCurrency(payment.amount, payment.currency)}
                        </h3>
                        {getStatusBadge(payment.status, "payment")}
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                          {payment.paymentMethod}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(payment.paymentDate)}
                      </p>
                      {payment.description && (
                        <p className="text-xs text-muted-foreground">{payment.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}




