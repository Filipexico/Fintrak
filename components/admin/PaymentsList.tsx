"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { useToastContext } from "@/components/providers/ToastProvider"
import { apiFetch, apiDelete } from "@/lib/utils/api"
import { logger } from "@/lib/logger"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { PaymentForm } from "./PaymentForm"

type Payment = {
  id: string
  userId: string
  subscriptionId: string | null
  amount: number
  currency: string
  paymentDate: string
  paymentMethod: string
  status: "paid" | "failed" | "refunded" | "pending"
  description: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  subscription: {
    id: string
    plan: {
      name: string
      displayName: string
    }
  } | null
}

export function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterMethod, setFilterMethod] = useState<string | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const { success, error: showError } = useToastContext()

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.set("status", filterStatus)
      if (filterMethod) params.set("paymentMethod", filterMethod)
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)

      const result = await apiFetch<Payment[]>(`/api/admin/payments?${params}`)
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        // Filtrar por busca (nome/email do usuário)
        let filtered = result.data
        if (search) {
          const searchLower = search.toLowerCase()
          filtered = result.data.filter(
            (payment) =>
              payment.user.name.toLowerCase().includes(searchLower) ||
              payment.user.email.toLowerCase().includes(searchLower)
          )
        }
        setPayments(filtered)
      }
    } catch (error) {
      logger.error("Erro ao carregar pagamentos", error instanceof Error ? error : undefined)
      showError("Erro ao carregar pagamentos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterMethod, startDate, endDate])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchPayments()
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Tem certeza que deseja deletar este pagamento?")) {
      return
    }

    try {
      const result = await apiDelete(`/api/admin/payments/${paymentId}`)
      if (result.error) {
        showError(result.error)
      } else {
        success("Pagamento deletado com sucesso")
        fetchPayments()
      }
    } catch (error) {
      logger.error("Erro ao deletar pagamento", error instanceof Error ? error : undefined)
      showError("Erro ao deletar pagamento")
    }
  }

  const getStatusBadge = (status: string) => {
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
          <option value="paid">Pago</option>
          <option value="pending">Pendente</option>
          <option value="failed">Falhou</option>
          <option value="refunded">Reembolsado</option>
        </select>
        <select
          value={filterMethod || ""}
          onChange={(e) => setFilterMethod(e.target.value || null)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos os métodos</option>
          <option value="card">Cartão</option>
          <option value="paypal">PayPal</option>
          <option value="pix">PIX</option>
          <option value="bank_transfer">Transferência</option>
          <option value="manual">Manual</option>
        </select>
        <Input
          type="date"
          placeholder="Data inicial"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-auto"
        />
        <Input
          type="date"
          placeholder="Data final"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-auto"
        />
        <Button
          onClick={() => {
            setEditingPayment(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Pagamento
        </Button>
      </div>

      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onClose={() => {
            setShowForm(false)
            setEditingPayment(null)
            fetchPayments()
          }}
        />
      )}

      <div className="space-y-2">
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{payment.user.name}</h3>
                      {getStatusBadge(payment.status)}
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        {payment.paymentMethod}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{payment.user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(payment.amount, payment.currency)} •{" "}
                      {formatDate(payment.paymentDate)}
                    </p>
                    {payment.subscription && (
                      <p className="text-xs text-muted-foreground">
                        Plano: {payment.subscription.plan.displayName}
                      </p>
                    )}
                    {payment.description && (
                      <p className="text-xs text-muted-foreground">{payment.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPayment(payment)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(payment.id)}
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




