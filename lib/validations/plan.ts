import { z } from "zod"

export const createPlanSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  displayName: z.string().min(1, "Nome de exibição é obrigatório"),
  priceMonthly: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
})

export const updatePlanSchema = createPlanSchema.partial()

export type CreatePlanInput = z.infer<typeof createPlanSchema>
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>




