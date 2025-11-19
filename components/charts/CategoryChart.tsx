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
import { formatCurrency } from "@/lib/utils/format"

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
  const formatCurrencyValue = (value: number) => {
    return formatCurrency(value, currency || "BRL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
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
            <YAxis tickFormatter={formatCurrencyValue} />
            <Tooltip formatter={(value: number) => formatCurrencyValue(value)} />
            <Legend />
            <Bar dataKey="total" fill="#ef4444" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}




