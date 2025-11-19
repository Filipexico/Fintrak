"use client"

import { useState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createPaymentSchema,
  updatePaymentSchema,
  type CreatePaymentInput,
  type UpdatePaymentInput,
} from "@/lib/validations/payment"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiPost, apiPut } from "@/lib/utils/api"
import { X } from "lucide-react"
import { dateToInputFormat } from "@/lib/utils/format"

type PaymentFormProps = {
  payment?: {
    id: string
    userId: string
    subscriptionId: string | null
    amount: number
    currency: string
    paymentDate: string
    paymentMethod: string
    status: string
    description: string | null
  } | null
  onClose: () => void
}

export function PaymentForm({ payment, onClose }: PaymentFormProps) {
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [subscriptions, setSubscriptions] = useState<
    Array<{ id: string; plan: { displayName: string } }>
  >([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { success, error: showError } = useToastContext()

  const isEditing = !!payment

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreatePaymentInput | UpdatePaymentInput>({
    resolver: zodResolver(isEditing ? updatePaymentSchema : createPaymentSchema),
    defaultValues: payment
      ? {
          amount: payment.amount,
          currency: payment.currency,
          paymentDate: dateToInputFormat(payment.paymentDate),
          paymentMethod: payment.paymentMethod,
          status: payment.status as any,
          description: payment.description || "",
        }
      : {
          currency: "BRL",
          status: "pending",
        },
  })

  const selectedUserId = watch("userId")

  useEffect(() => {
    // Buscar usuários
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data.map((u: any) => ({ id: u.id, name: u.name, email: u.email })))
        }
      })
      .catch(() => {})

    if (payment) {
      setValue("userId", payment.userId)
      if (payment.subscriptionId) {
        setValue("subscriptionId", payment.subscriptionId)
      }
    }
  }, [payment, setValue])

  useEffect(() => {
    // Buscar assinaturas do usuário selecionado
    if (selectedUserId && !isEditing) {
      fetch(`/api/admin/subscriptions?userId=${selectedUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSubscriptions(
              data.map((s: any) => ({
                id: s.id,
                plan: { displayName: s.plan.displayName },
              }))
            )
          }
        })
        .catch(() => {})
    }
  }, [selectedUserId, isEditing])

  const onSubmit: SubmitHandler<CreatePaymentInput | UpdatePaymentInput> = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      if (isEditing && payment) {
        const result = await apiPut(`/api/admin/payments/${payment.id}`, data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
          setIsLoading(false)
          return
        }
        success("Pagamento atualizado com sucesso")
      } else {
        const result = await apiPost("/api/admin/payments", data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
          setIsLoading(false)
          return
        }
        success("Pagamento criado com sucesso")
      }

      reset()
      onClose()
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro ao salvar pagamento. Tente novamente."
      setError(errorMsg)
      showError(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{isEditing ? "Editar Pagamento" : "Novo Pagamento"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="userId">Usuário</Label>
                <select
                  id="userId"
                  {...register("userId")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isLoading}
                >
                  <option value="">Selecione um usuário</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {!isEditing && "userId" in errors && errors.userId && (
                  <p className="text-sm text-destructive">
                    {(errors.userId as any)?.message}
                  </p>
                )}
              </div>
            )}

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="subscriptionId">Assinatura (opcional)</Label>
                <select
                  id="subscriptionId"
                  {...register("subscriptionId")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isLoading || !selectedUserId}
                >
                  <option value="">Nenhuma</option>
                  {subscriptions.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.plan.displayName}
                    </option>
                  ))}
                </select>
                {"subscriptionId" in errors && errors.subscriptionId && (
                  <p className="text-sm text-destructive">
                    {(errors.subscriptionId as any)?.message}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {(errors.amount as any)?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <select
                  id="currency"
                  {...register("currency")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isLoading}
                >
                  <option value="BRL">BRL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                {errors.currency && (
                  <p className="text-sm text-destructive">
                    {(errors.currency as any)?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Data do Pagamento</Label>
              <Input
                id="paymentDate"
                type="date"
                {...register("paymentDate")}
                disabled={isLoading}
              />
              {errors.paymentDate && (
                <p className="text-sm text-destructive">
                  {(errors.paymentDate as any)?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                <select
                  id="paymentMethod"
                  {...register("paymentMethod")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isLoading}
                >
                  <option value="card">Cartão</option>
                  <option value="paypal">PayPal</option>
                  <option value="pix">PIX</option>
                  <option value="bank_transfer">Transferência</option>
                  <option value="manual">Manual</option>
                </select>
                {errors.paymentMethod && (
                  <p className="text-sm text-destructive">
                    {(errors.paymentMethod as any)?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isLoading}
                >
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="failed">Falhou</option>
                  <option value="refunded">Reembolsado</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-destructive">
                    {(errors.status as any)?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Descrição do pagamento"
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {(errors.description as any)?.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

