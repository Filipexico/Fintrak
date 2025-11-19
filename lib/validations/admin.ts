import { z } from "zod"

// Validação para criar usuário pelo admin
export const createUserByAdminSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  country: z.string().length(2, "Código do país deve ter 2 caracteres"),
  currency: z.string().min(1, "Moeda é obrigatória"),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
  isActive: z.boolean().optional().default(true),
})

export type CreateUserByAdminInput = z.infer<typeof createUserByAdminSchema>

// Validação para alterar senha do admin
export const changeAdminPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export type ChangeAdminPasswordInput = z.infer<typeof changeAdminPasswordSchema>

// Validação para alterar email do admin
export const changeAdminEmailSchema = z.object({
  newEmail: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória para confirmar alteração"),
})

export type ChangeAdminEmailInput = z.infer<typeof changeAdminEmailSchema>

// Validação para setup inicial
export const setupAdminSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  name: z.string().min(1, "Nome é obrigatório").optional(),
})

export type SetupAdminInput = z.infer<typeof setupAdminSchema>




