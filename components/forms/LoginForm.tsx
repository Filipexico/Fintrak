"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const callbackUrl = searchParams.get("callbackUrl")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { error: showError } = useToastContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        console.error("Login error:", result.error)
        let errorMsg = result.error || "Email ou senha inválidos. Por favor, verifique suas credenciais e tente novamente."
        
        // Mensagens de erro mais específicas
        if (result.error.includes("credentials") || result.error.includes("Email ou senha")) {
          errorMsg = "Email ou senha inválidos. Verifique suas credenciais e tente novamente."
        } else if (result.error.includes("desativada")) {
          errorMsg = "Conta desativada. Entre em contato com o suporte."
        } else {
          errorMsg = `Erro ao fazer login: ${result.error}`
        }
        
        setError(errorMsg)
        showError(errorMsg)
        setIsLoading(false)
        return
      }

      // Aguardar um pouco para a sessão ser atualizada
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Buscar a sessão atualizada para verificar o role
      const response = await fetch("/api/auth/session")
      const sessionData = await response.json()

      // Redirecionar baseado no role
      if (sessionData?.user?.role === "ADMIN") {
        router.push(callbackUrl && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin")
      } else {
        router.push(callbackUrl && !callbackUrl.startsWith("/admin") ? callbackUrl : "/dashboard")
      }
      
      router.refresh()
    } catch (err) {
      const errorMsg = "Erro ao fazer login. Por favor, verifique suas credenciais e tente novamente."
      setError(errorMsg)
      showError(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Entre com suas credenciais</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
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
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Não tem uma conta? </span>
          <a href="/signup" className="text-primary hover:underline">
            Cadastre-se
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

