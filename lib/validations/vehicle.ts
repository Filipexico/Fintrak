import { z } from "zod"
import { VEHICLE_TYPES, FUEL_TYPES } from "@/lib/constants"

export const vehicleSchema = z.object({
  name: z.string().min(1, "Nome do veículo é obrigatório").max(100, "Nome muito longo"),
  type: z.enum(VEHICLE_TYPES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Tipo de veículo inválido" }),
  }).optional().nullable(),
  plate: z.string().max(20, "Placa muito longa").optional().nullable(),
  fuelType: z.enum(FUEL_TYPES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Tipo de combustível inválido" }),
  }).optional().nullable(),
  notes: z.string().max(500, "Notas muito longas").optional().nullable(),
  isActive: z.boolean().default(true),
})

export type VehicleInput = z.infer<typeof vehicleSchema>

