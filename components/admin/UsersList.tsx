"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, Ban, CheckCircle, Trash2, Search } from "lucide-react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  name: string
  country: string
  currency: string
  role: string
  isActive: boolean
  createdAt: string
  _count: {
    incomes: number
    expenses: number
    platforms: number
  }
}

export function UsersList() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterActive, setFilterActive] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (filterActive !== null) params.set("isActive", filterActive)

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, filterActive])

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao atualizar usuário")
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      alert("Erro ao atualizar usuário")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao deletar usuário")
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error)
      alert("Erro ao deletar usuário")
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterActive || ""}
          onChange={(e) => setFilterActive(e.target.value || null)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      <div className="space-y-2">
        {users.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum usuário encontrado.
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isActive ? "Ativo" : "Inativo"}
                      </span>
                      {user.role === "ADMIN" && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.country} • {user.currency} • {user._count.incomes} receitas • {user._count.expenses} despesas
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                    >
                      {user.isActive ? (
                        <Ban className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
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




