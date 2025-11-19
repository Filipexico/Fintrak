"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryExpense {
  category: string
  total: number
  percentage: number
}

interface CategoryChartProps {
  data: CategoryExpense[]
  currency: string
}

const categoryLabels: Record<string, string> = {
  fuel: "Combustível",
  insurance: "Seguro",
  phone: "Telefone",
  maintenance: "Manutenção",
  food: "Alimentação",
  parking: "Estacionamento",
  tolls: "Pedágio",
  other: "Outros",
}

export function CategoryChart({ data, currency }: CategoryChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const chartData = data.map((item) => ({
    category: categoryLabels[item.category] || item.category,
    total: item.total,
    percentage: item.percentage.toFixed(1),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total" fill="#ef4444" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}




