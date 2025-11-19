import { z } from "zod"

export const createSubscriptionSchema = z.object({
  userId: z.string().min(1, "Usuário é obrigatório"),
  planId: z.string().min(1, "Plano é obrigatório"),
  status: z.enum(["active", "canceled", "trial", "overdue"]).optional().default("trial"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional().nullable(),
  nextBillingDate: z.string().optional().nullable(),
})

export const updateSubscriptionSchema = z.object({
  planId: z.string().min(1).optional(),
  status: z.enum(["active", "canceled", "trial", "overdue"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  nextBillingDate: z.string().optional().nullable(),
})

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>




