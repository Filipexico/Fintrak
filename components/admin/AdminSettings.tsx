"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  changeAdminPasswordSchema,
  changeAdminEmailSchema,
  type ChangeAdminPasswordInput,
  type ChangeAdminEmailInput,
} from "@/lib/validations/admin"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { apiPut } from "@/lib/utils/api"
import { useSession } from "next-auth/react"
import { Key, Mail, User as UserIcon } from "lucide-react"

export function AdminSettings() {
  const { data: session } = useSession()
  const { success, error: showError } = useToastContext()
  const [activeTab, setActiveTab] = useState<"password" | "email" | "profile">("password")

  const passwordForm = useForm<ChangeAdminPasswordInput>({
    resolver: zodResolver(changeAdminPasswordSchema),
  })

  const emailForm = useForm<ChangeAdminEmailInput>({
    resolver: zodResolver(changeAdminEmailSchema),
  })

  const profileForm = useForm<{ name: string }>({
    defaultValues: {
      name: session?.user?.name || "",
    },
  })

  const [loading, setLoading] = useState({
    password: false,
    email: false,
    profile: false,
  })

  const onPasswordSubmit: SubmitHandler<ChangeAdminPasswordInput> = async (data) => {
    setLoading({ ...loading, password: true })
    try {
      const result = await apiPut("/api/admin/settings/password", data)
      if (result.error) {
        showError(result.error)
      } else {
        success("Senha alterada com sucesso")
        passwordForm.reset()
      }
    } catch (error) {
      showError("Erro ao alterar senha. Tente novamente.")
    } finally {
      setLoading({ ...loading, password: false })
    }
  }

  const onEmailSubmit: SubmitHandler<ChangeAdminEmailInput> = async (data) => {
    setLoading({ ...loading, email: true })
    try {
      const result = await apiPut("/api/admin/settings/email", data)
      if (result.error) {
        showError(result.error)
      } else {
        success("Email alterado com sucesso. Faça login novamente.")
        emailForm.reset()
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      }
    } catch (error) {
      showError("Erro ao alterar email. Tente novamente.")
    } finally {
      setLoading({ ...loading, email: false })
    }
  }

  const onProfileSubmit = async (data: { name: string }) => {
    setLoading({ ...loading, profile: true })
    try {
      const result = await apiPut("/api/admin/settings/profile", data)
      if (result.error) {
        showError(result.error)
      } else {
        success("Perfil atualizado com sucesso")
        // Atualizar sessão pode ser necessário aqui
      }
    } catch (error) {
      showError("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setLoading({ ...loading, profile: false })
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "password"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Key className="inline mr-2 h-4 w-4" />
          Alterar Senha
        </button>
        <button
          onClick={() => setActiveTab("email")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "email"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="inline mr-2 h-4 w-4" />
          Alterar Email
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserIcon className="inline mr-2 h-4 w-4" />
          Perfil
        </button>
      </div>

      {/* Alterar Senha */}
      {activeTab === "password" && (
        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>
              Altere sua senha de acesso. A senha deve conter pelo menos 8 caracteres, incluindo
              letras maiúsculas, minúsculas e números.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  disabled={loading.password}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                  disabled={loading.password}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  disabled={loading.password}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading.password}>
                {loading.password ? "Alterando..." : "Alterar Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Alterar Email */}
      {activeTab === "email" && (
        <Card>
          <CardHeader>
            <CardTitle>Alterar Email</CardTitle>
            <CardDescription>
              Altere seu endereço de email. Será necessário fazer login novamente após a alteração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentEmail">Email Atual</Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newEmail">Novo Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  {...emailForm.register("newEmail")}
                  disabled={loading.email}
                />
                {emailForm.formState.errors.newEmail && (
                  <p className="text-sm text-destructive">
                    {emailForm.formState.errors.newEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha (confirmação)</Label>
                <Input
                  id="password"
                  type="password"
                  {...emailForm.register("password")}
                  disabled={loading.email}
                />
                {emailForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {emailForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading.email}>
                {loading.email ? "Alterando..." : "Alterar Email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Perfil */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  {...profileForm.register("name", { required: "Nome é obrigatório" })}
                  disabled={loading.profile}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <Button type="submit" disabled={loading.profile}>
                {loading.profile ? "Atualizando..." : "Atualizar Perfil"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}




