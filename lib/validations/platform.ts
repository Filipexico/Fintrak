import { z } from "zod"

export const createPlatformSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
})

export const updatePlatformSchema = createPlatformSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export type CreatePlatformInput = z.infer<typeof createPlatformSchema>
export type UpdatePlatformInput = z.infer<typeof updatePlatformSchema>




