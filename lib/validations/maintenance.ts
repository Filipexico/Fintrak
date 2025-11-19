import { z } from "zod"
import { MAINTENANCE_TYPES } from "@/lib/constants"

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  type: z.enum(MAINTENANCE_TYPES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Tipo de manutenção inválido" }),
  }),
  description: z.string().max(500, "Descrição muito longa").optional().nullable(),
  cost: z
    .number({
      invalid_type_error: "Custo deve ser um número",
    })
    .nonnegative("Custo não pode ser negativo")
    .max(1000000, "Custo muito alto")
    .optional()
    .nullable(),
  currency: z.string().min(3, "Moeda inválida").max(3, "Moeda inválida").default("BRL"),
  mileage: z
    .number({
      invalid_type_error: "Quilometragem deve ser um número",
    })
    .nonnegative("Quilometragem não pode ser negativo")
    .max(1000000, "Quilometragem muito alta")
    .optional()
    .nullable(),
  notes: z.string().max(500, "Notas muito longas").optional().nullable(),
})

export type MaintenanceInput = z.infer<typeof maintenanceSchema>




