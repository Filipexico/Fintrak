import { z } from "zod"
import { EXPENSE_CATEGORIES } from "@/lib/constants"

export const createExpenseSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: "Categoria inválida" }),
  }),
  amount: z.number().positive("Valor deve ser positivo"),
  currency: z.string().min(3, "Moeda inválida").max(3, "Moeda inválida"),
  date: z.string().or(z.date()),
  description: z.string().max(500, "Descrição muito longa").nullable().optional(),
})

export const updateExpenseSchema = createExpenseSchema.partial()

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>




