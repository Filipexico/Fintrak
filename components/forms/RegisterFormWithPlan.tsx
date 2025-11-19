"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validations/auth"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/utils/api"
import { logger } from "@/lib/logger"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"
import { CURRENCIES_SORTED } from "@/lib/constants/currencies"
import { Check } from "lucide-react"

interface Plan {
  id: string
  name: string
  displayName: string
  priceMonthly: number | string
  maxVehicles: number | null
  maxPlatforms: number | null
}

interface RegisterFormWithPlanProps {
  initialPlan?: string
  locale: string
}

export function RegisterFormWithPlan({ initialPlan = "free", locale }: RegisterFormWithPlanProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error: showError } = useToastContext()
  const router = useRouter()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log("RegisterFormWithPlan - Carregando planos...")
        const result = await apiFetch<Plan[]>("/api/plans")
        console.log("RegisterFormWithPlan - Resultado da API:", result)
        
        if (result.error) {
          console.error("RegisterFormWithPlan - Erro ao carregar planos:", result.error)
          logger.error("Erro ao carregar planos", undefined, { error: result.error })
          showError("Erro ao carregar planos. Por favor, recarregue a página.")
          setLoading(false)
          return
        }
        
        if (result.data && Array.isArray(result.data)) {
          // Mapear e garantir que os dados estão corretos
          const mappedPlans = result.data.map((plan: any) => ({
            id: plan.id,
            name: plan.name || "",
            displayName: plan.displayName || plan.name || "",
            priceMonthly: plan.priceMonthly || 0,
            maxVehicles: plan.maxVehicles ?? null,
            maxPlatforms: plan.maxPlatforms ?? null,
          })).filter((plan: Plan) => plan.id && plan.name)
          
          console.log("RegisterFormWithPlan - Planos mapeados:", mappedPlans)
          
          if (mappedPlans.length === 0) {
            console.warn("RegisterFormWithPlan - Nenhum plano ativo encontrado")
            showError("Nenhum plano disponível no momento. Entre em contato com o suporte.")
          } else {
            setPlans(mappedPlans)
            const planExists = mappedPlans.find((p) => p.name === initialPlan)
            if (planExists) {
              setSelectedPlan(initialPlan)
            } else if (mappedPlans.length > 0) {
              // Se o plano inicial não existe, usar o primeiro disponível
              setSelectedPlan(mappedPlans[0].name)
            }
          }
        } else {
          console.warn("RegisterFormWithPlan - Formato de resposta inválido:", result)
          showError("Erro ao carregar planos. Por favor, recarregue a página.")
        }
      } catch (error) {
        console.error("RegisterFormWithPlan - Erro ao carregar planos:", error)
        logger.error("Erro ao carregar planos", error instanceof Error ? error : undefined)
        showError("Erro ao carregar planos. Por favor, recarregue a página.")
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [initialPlan, showError])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      language: "pt-BR",
    },
  })

  const onSubmit = async (data: any) => {
    // Se o plano for "plus", redirecionar para página de contato
    if (selectedPlan === "plus") {
      router.push("/contact?plan=plus")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          planName: selectedPlan,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMsg = result.error || "Erro ao criar conta"
        showError(errorMsg)
        setIsSubmitting(false)
        return
      }

      success("Conta criada com sucesso! Redirecionando...")
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (error) {
      logger.error("Erro ao registrar", error instanceof Error ? error : undefined)
      showError("Erro ao criar conta. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  const selectedPlanData = plans.find((p) => p.name === selectedPlan)

  if (loading) {
    return <div className="text-center py-8">Carregando planos...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Escolha um plano e crie sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Plan Selection */}
        <div className="mb-6">
          <Label className="mb-3 block">Escolha seu plano</Label>
          {plans.length === 0 && !loading && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 mb-4">
              <p className="text-sm text-yellow-800">
                Nenhum plano disponível no momento. Entre em contato com o suporte.
              </p>
            </div>
          )}
          <div className="grid gap-3">
            {plans.length > 0 ? plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.name)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedPlan === plan.name
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{plan.displayName}</div>
                    <div className="text-sm text-muted-foreground">
                      {Number(plan.priceMonthly) === 0
                        ? "Grátis"
                        : plan.name === "plus"
                        ? "Entre em contato com o suporte"
                        : `€${Number(plan.priceMonthly).toFixed(2)}/mês`}
                    </div>
                    {plan.name !== "plus" && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {plan.maxVehicles === null
                          ? "Veículos ilimitados"
                          : `${plan.maxVehicles} ${plan.maxVehicles > 1 ? "veículos" : "veículo"}`}
                        {" • "}
                        {plan.maxPlatforms === null
                          ? "Plataformas ilimitadas"
                          : `${plan.maxPlatforms} ${plan.maxPlatforms > 1 ? "plataformas" : "plataforma"}`}
                      </div>
                    )}
                  </div>
                  {selectedPlan === plan.name && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>
            )) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Nenhum plano disponível
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" {...register("name" as any)} />
            {errors.name && (
              <p className="text-sm text-destructive">{(errors.name as any)?.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email" as any)} />
            {errors.email && (
              <p className="text-sm text-destructive">{(errors.email as any)?.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register("password" as any)} />
            {errors.password && (
              <p className="text-sm text-destructive">{(errors.password as any)?.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword" as any)} />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{(errors.confirmPassword as any)?.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input id="country" {...register("country" as any)} placeholder="BR, US, etc." />
            {errors.country && (
              <p className="text-sm text-destructive">{(errors.country as any)?.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <select
              id="currency"
              {...register("currency" as any)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {CURRENCIES_SORTED.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} {currency.symbol ? `(${currency.symbol})` : ""}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-sm text-destructive">{(errors.currency as any)?.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <select
              id="language"
              {...register("language" as any)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
            {errors.language && (
              <p className="text-sm text-destructive">{(errors.language as any)?.message as string}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
            {isSubmitting ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
