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

interface FuelChartProps {
  data: Array<{ date: string; fuel?: number; energy?: number }>
}

export function FuelChart({ data }: FuelChartProps) {
  // Formatar datas para exibição
  const formattedData = data.map((item) => ({
    ...item,
    dateLabel: new Date(item.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    value: item.energy || item.fuel || 0,
    unit: item.energy ? "kWh" : "L",
    label: item.energy ? "Energia" : "Combustível",
  }))

  const hasEnergy = data.some((item) => item.energy)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateLabel" />
        <YAxis />
        <Tooltip
          formatter={(value: number, name: string, props: any) => [
            `${value.toFixed(2)} ${props.payload.unit}`,
            props.payload.label,
          ]}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Legend />
        {hasEnergy ? (
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#00C49F"
            strokeWidth={2}
            name="Energia (kWh)"
          />
        ) : (
          <Line
            type="monotone"
            dataKey="fuel"
            stroke="#00C49F"
            strokeWidth={2}
            name="Combustível (L)"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

