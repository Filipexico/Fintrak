import { z } from "zod"

export const createIncomeSchema = z.object({
  platformId: z.string().nullable().optional(),
  amount: z.number().positive("Valor deve ser positivo"),
  currency: z.string().min(3, "Moeda inválida").max(3, "Moeda inválida"),
  date: z.string().or(z.date()),
  description: z.string().max(500, "Descrição muito longa").nullable().optional(),
})

export const updateIncomeSchema = createIncomeSchema.partial()

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>




