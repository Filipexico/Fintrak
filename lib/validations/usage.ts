import { z } from "zod"

// Schema para formulários (aceita string para date)
export const usageLogFormSchema = z.object({
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  distanceKm: z
    .number({
      required_error: "Distância é obrigatória",
      invalid_type_error: "Distância deve ser um número",
    })
    .positive("Distância deve ser maior que zero")
    .max(10000, "Distância muito alta (máximo 10.000 km)"),
  fuelLiters: z
    .number({
      invalid_type_error: "Combustível deve ser um número",
    })
    .nonnegative("Combustível não pode ser negativo")
    .max(1000, "Combustível muito alto (máximo 1.000 litros)")
    .optional()
    .nullable(),
  energyKwh: z
    .number({
      invalid_type_error: "Energia deve ser um número",
    })
    .nonnegative("Energia não pode ser negativo")
    .max(1000, "Energia muito alta (máximo 1.000 kWh)")
    .optional()
    .nullable(),
  notes: z.string().max(500, "Notas muito longas").optional().nullable(),
})

// Schema para API (converte string para Date)
export const usageLogSchema = usageLogFormSchema.extend({
  date: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val)
    }
    return val
  }),
})

export type UsageLogInput = z.infer<typeof usageLogFormSchema>

