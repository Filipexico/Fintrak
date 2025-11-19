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

interface DistanceChartProps {
  data: Array<{ date: string; distance: number }>
}

export function DistanceChart({ data }: DistanceChartProps) {
  // Formatar datas para exibição
  const formattedData = data.map((item) => ({
    ...item,
    dateLabel: new Date(item.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateLabel" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(2)} km`, "Distância"]}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="distance"
          stroke="#0088FE"
          strokeWidth={2}
          name="Distância (km)"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}



