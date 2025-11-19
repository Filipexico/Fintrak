"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingCard } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { useToastContext } from "@/components/providers/ToastProvider"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { PlatformForm } from "./PlatformForm"
import type { PlatformListItem } from "@/types"
import { apiFetch, apiDelete } from "@/lib/utils/api"
import { logger } from "@/lib/logger"

export function PlatformsList() {
  const [platforms, setPlatforms] = useState<PlatformListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState<PlatformListItem | null>(null)
  const { success, error: showError } = useToastContext()

  const fetchPlatforms = async () => {
    try {
      const result = await apiFetch<PlatformListItem[]>("/api/platforms")
      if (result.error) {
        showError(result.error)
      } else if (result.data) {
        setPlatforms(result.data)
      }
    } catch (error) {
      logger.error("Erro ao carregar plataformas", error instanceof Error ? error : undefined)
      showError("Erro ao carregar plataformas. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlatforms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja desativar esta plataforma?")) {
      return
    }

    try {
      const result = await apiDelete(`/api/platforms/${id}`)
      if (result.error) {
        showError(result.error)
      } else {
        success("Plataforma desativada com sucesso")
        fetchPlatforms()
      }
    } catch (error) {
      logger.error("Erro ao deletar plataforma", error instanceof Error ? error : undefined)
      showError("Erro ao desativar plataforma. Tente novamente.")
    }
  }

  const handleEdit = (platform: PlatformListItem) => {
    setEditingPlatform(platform)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingPlatform(null)
    fetchPlatforms()
  }

  if (loading) {
    return <LoadingCard />
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Plataforma
        </Button>
      </div>

      {showForm && (
        <PlatformForm
          platform={editingPlatform}
          onClose={handleFormClose}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Package}
              title="Nenhuma plataforma cadastrada"
              description="Comece adicionando sua primeira plataforma de entrega."
              action={{
                label: "Nova Plataforma",
                onClick: () => setShowForm(true),
              }}
            />
          </div>
        ) : (
          platforms.map((platform) => (
            <Card key={platform.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{platform.name}</CardTitle>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      platform.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {platform.isActive ? "Ativa" : "Inativa"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(platform)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(platform.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

