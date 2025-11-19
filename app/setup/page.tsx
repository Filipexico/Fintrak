"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { setupAdminSchema, type SetupAdminInput } from "@/lib/validations/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Loader2, Shield } from "lucide-react"

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { success, error: showError } = useToastContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupAdminInput>({
    resolver: zodResolver(setupAdminSchema),
    defaultValues: {
      name: "Administrador",
    },
  })

  // Verificar se já existe admin
  useEffect(() => {
    fetch("/api/setup/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasAdmin) {
          // Já existe admin, redirecionar para login
          router.push("/login")
        } else {
          setLoading(false)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }, [router])

  const onSubmit = async (data: SetupAdminInput) => {
    setSubmitting(true)

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        showError(result.error || "Erro ao criar conta admin")
        setSubmitting(false)
        return
      }

      success("Conta admin criada com sucesso! Redirecionando para login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      showError("Erro ao criar conta admin. Tente novamente.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verificando configuração...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Configuração Inicial</CardTitle>
          <CardDescription>
            Crie a primeira conta de administrador do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Administrador"
                disabled={submitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="admin@example.com"
                disabled={submitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Mínimo 8 caracteres"
                disabled={submitting}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                A senha deve conter: mínimo 8 caracteres, pelo menos uma letra minúscula, uma maiúscula e um número
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta Admin"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}




