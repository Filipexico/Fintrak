"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react"

interface Analytics {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  totalIncomes: {
    count: number
    sum: number
  }
  totalExpenses: {
    count: number
    sum: number
  }
  totalPlatforms: number
  usersByCountry: Array<{ country: string; count: number }>
  recentUsers: Array<{
    id: string
    name: string
    email: string
    createdAt: string
  }>
}

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erro ao carregar analytics:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!analytics) {
    return <div>Erro ao carregar dados</div>
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeUsers} ativos, {analytics.inactiveUsers} inativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Rastreadas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.totalIncomes.sum)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalIncomes.count} registros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Rastreadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.totalExpenses.sum)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalExpenses.count} registros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plataformas Ativas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPlatforms}</div>
            <p className="text-xs text-muted-foreground">
              Total de plataformas cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usuários por País */}
      {analytics.usersByCountry.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usuários por País</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.usersByCountry.map((item) => (
                <div
                  key={item.country}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{item.country}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usuários Recentes */}
      {analytics.recentUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}




