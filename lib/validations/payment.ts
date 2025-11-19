import { z } from "zod"

// Schema para formulários (aceita string para paymentDate)
export const createPaymentFormSchema = z.object({
  userId: z.string().min(1, "Usuário é obrigatório"),
  subscriptionId: z.string().optional().nullable(),
  amount: z
    .number({
      required_error: "Valor é obrigatório",
      invalid_type_error: "Valor deve ser um número",
    })
    .positive("Valor deve ser maior que zero"),
  currency: z.string().min(3, "Moeda é obrigatória").max(3, "Código de moeda inválido").default("BRL"),
  paymentDate: z.string().min(1, "Data de pagamento é obrigatória"),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  status: z.enum(["paid", "failed", "refunded", "pending"]).default("pending"),
  description: z.string().max(500, "Descrição muito longa").optional().nullable(),
})

// Schema para API (converte string para Date)
export const createPaymentSchema = createPaymentFormSchema.extend({
  paymentDate: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val)
    }
    return val
  }),
})

export const updatePaymentFormSchema = createPaymentFormSchema.partial().extend({
  userId: z.string().optional(),
  subscriptionId: z.string().optional().nullable(),
})

export const updatePaymentSchema = createPaymentSchema.partial().extend({
  userId: z.string().optional(),
  subscriptionId: z.string().optional().nullable(),
})

export type CreatePaymentInput = z.infer<typeof createPaymentFormSchema>
export type UpdatePaymentInput = z.infer<typeof updatePaymentFormSchema>

