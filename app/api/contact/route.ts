import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendContactEmail } from "@/lib/utils/email"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().optional(),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
  plan: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const emailSent = await sendContactEmail({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      plan: validatedData.plan,
    })

    if (!emailSent) {
      logger.warn("Email não foi enviado, mas formulário foi processado")
    }

    return NextResponse.json(
      {
        message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        emailSent,
      },
      { status: 200 }
    )
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao processar formulário de contato", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

export const dynamic = "force-dynamic"

