"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/format"

interface MonthlyData {
  month: string
  income: number
  expenses: number
  profit: number
}

interface MonthlyChartProps {
  data: MonthlyData[]
  currency: string
}

export function MonthlyChart({ data, currency }: MonthlyChartProps) {
  const formatCurrencyValue = (value: number) => {
    return formatCurrency(value, currency || "BRL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita vs Despesas (Mensal)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrencyValue} />
            <Tooltip formatter={(value: number) => formatCurrencyValue(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              name="Receita"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              name="Despesas"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Lucro"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}




