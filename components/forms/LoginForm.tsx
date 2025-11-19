"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const callbackUrl = searchParams.get("callbackUrl")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
        console.error("Full result:", result)
        
        let errorMsg = "Email ou senha inválidos. Verifique suas credenciais e tente novamente."
        
        // Mensagens de erro mais específicas
        if (result.error) {
          if (result.error.includes("Email ou senha") || result.error.includes("inválidos")) {
            errorMsg = "❌ Email ou senha inválidos. Verifique suas credenciais e tente novamente."
          } else if (result.error.includes("desativada")) {
            errorMsg = "⚠️ Conta desativada. Entre em contato com o suporte."
          } else if (result.error.includes("obrigatórios")) {
            errorMsg = "⚠️ Email e senha são obrigatórios."
          } else {
            errorMsg = `❌ Erro: ${result.error}`
          }
        }
        
        console.error("Erro final a exibir:", errorMsg)
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
      console.error("Erro no catch do login:", err)
      const errorMsg = err instanceof Error 
        ? `Erro ao fazer login: ${err.message}` 
        : "Erro ao fazer login. Por favor, verifique suas credenciais e tente novamente."
      setError(errorMsg)
      showError(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <Link href="/home">
        <Button variant="outline" className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Voltar para a página inicial
        </Button>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 border border-destructive/50 p-4 text-sm text-destructive font-medium">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
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
    </div>
  )
}

