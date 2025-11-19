"use client"

import { useState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPlatformSchema, updatePlatformSchema } from "@/lib/validations/platform"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PlatformFormData, PlatformListItem } from "@/types"
import { apiPost, apiPut } from "@/lib/utils/api"

type PlatformFormProps = {
  platform?: PlatformListItem | null
  onClose: () => void
}

export function PlatformForm({ platform, onClose }: PlatformFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { success, error: showError } = useToastContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlatformFormData>({
    resolver: zodResolver(platform ? updatePlatformSchema : createPlatformSchema),
    defaultValues: platform || { name: "", isActive: true },
  })

  useEffect(() => {
    if (platform) {
      reset({
        name: platform.name,
        isActive: platform.isActive,
      })
    }
  }, [platform, reset])

  const onSubmit: SubmitHandler<PlatformFormData> = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = platform
        ? await apiPut<PlatformListItem>(`/api/platforms/${platform.id}`, data)
        : await apiPost<PlatformListItem>("/api/platforms", data)

      if (result.error) {
        // Check if it's a plan limit error
        if (result.details && typeof result.details === "object" && "upgradeRequired" in result.details) {
          const details = result.details as { upgradeRequired: boolean; plan: string; current: number; max: number }
          const errorMsg = `Limite de plataformas atingido no plano ${details.plan}. Você tem ${details.current} de ${details.max} plataformas. Faça upgrade para adicionar mais plataformas.`
          setError(errorMsg)
          showError(errorMsg)
        } else {
          const errorMsg = result.error || "Erro ao salvar plataforma"
          setError(errorMsg)
          showError(errorMsg)
        }
        setIsLoading(false)
        return
      }

      success(platform ? "Plataforma atualizada com sucesso" : "Plataforma criada com sucesso")
      onClose()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao salvar plataforma. Tente novamente."
      setError(errorMsg)
      showError(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {platform ? "Editar Plataforma" : "Nova Plataforma"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: Uber Eats"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            {platform && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive">Ativa</Label>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
