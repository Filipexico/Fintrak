"use client"

import { useState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  type CreateSubscriptionInput,
  type UpdateSubscriptionInput,
} from "@/lib/validations/subscription"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiPost, apiPut } from "@/lib/utils/api"
import { X } from "lucide-react"
import { dateToInputFormat } from "@/lib/utils/format"

type SubscriptionFormProps = {
  subscription?: {
    id: string
    userId: string
    planId: string
    status: string
    startDate: string
    endDate: string | null
    nextBillingDate: string | null
  } | null
  plans: Array<{ id: string; name: string; displayName: string }>
  onClose: () => void
}

export function SubscriptionForm({ subscription, plans, onClose }: SubscriptionFormProps) {
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { success, error: showError } = useToastContext()

  const isEditing = !!subscription

  // Debug: verificar se os planos foram recebidos
  useEffect(() => {
    console.log("SubscriptionForm - Planos recebidos:", plans)
    if (plans.length === 0) {
      console.warn("SubscriptionForm - Nenhum plano recebido!")
    }
  }, [plans])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateSubscriptionInput | UpdateSubscriptionInput>({
    resolver: zodResolver(isEditing ? updateSubscriptionSchema : createSubscriptionSchema),
    defaultValues: subscription
      ? {
          planId: subscription.planId,
          status: subscription.status as any,
          startDate: dateToInputFormat(subscription.startDate),
          endDate: subscription.endDate ? dateToInputFormat(subscription.endDate) : null,
          nextBillingDate: subscription.nextBillingDate
            ? dateToInputFormat(subscription.nextBillingDate)
            : null,
        }
      : {
          status: "trial",
        },
  })

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

    if (subscription) {
      setValue("userId", subscription.userId)
    }
  }, [subscription, setValue])

  const onSubmit: SubmitHandler<CreateSubscriptionInput | UpdateSubscriptionInput> = async (
    data
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      if (isEditing && subscription) {
        const result = await apiPut(`/api/admin/subscriptions/${subscription.id}`, data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
          setIsLoading(false)
          return
        }
        success("Assinatura atualizada com sucesso")
      } else {
        const result = await apiPost("/api/admin/subscriptions", data)
        if (result.error) {
          setError(result.error)
          showError(result.error)
          setIsLoading(false)
          return
        }
        success("Assinatura criada com sucesso")
      }

      reset()
      onClose()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao salvar assinatura. Tente novamente."
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
            <CardTitle>{isEditing ? "Editar Assinatura" : "Nova Assinatura"}</CardTitle>
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
                {"userId" in errors && errors.userId && (
                  <p className="text-sm text-destructive">
                    {(errors.userId as any)?.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="planId">Plano *</Label>
              <select
                id="planId"
                {...register("planId")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={isLoading}
              >
                <option value="">Selecione um plano</option>
                {plans.length > 0 ? (
                  plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.displayName || plan.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Carregando planos...</option>
                )}
              </select>
              {plans.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum plano cadastrado. Cadastre planos antes de criar assinaturas.
                </p>
              )}
              {errors.planId && (
                <p className="text-sm text-destructive">
                  {(errors.planId as any)?.message}
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
                <option value="trial">Trial</option>
                <option value="active">Ativa</option>
                <option value="overdue">Em Débito</option>
                <option value="canceled">Cancelada</option>
              </select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {(errors.status as any)?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                disabled={isLoading}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">
                  {(errors.startDate as any)?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término (opcional)</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
                disabled={isLoading}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">
                  {(errors.endDate as any)?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextBillingDate">Próxima Cobrança (opcional)</Label>
              <Input
                id="nextBillingDate"
                type="date"
                {...register("nextBillingDate")}
                disabled={isLoading}
              />
              {errors.nextBillingDate && (
                <p className="text-sm text-destructive">
                  {(errors.nextBillingDate as any)?.message}
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

