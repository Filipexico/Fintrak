import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/lib/validations/auth"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"
import { sendRegistrationEmail } from "@/lib/utils/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Get plan if provided
    let planId: string | null = null
    if (body.planName) {
      const plan = await prisma.plan.findUnique({
        where: { name: body.planName },
      })
      if (plan) {
        planId = plan.id
      }
    }

    // Default to Free plan if no plan specified
    if (!planId) {
      const freePlan = await prisma.plan.findUnique({
        where: { name: "free" },
      })
      if (freePlan) {
        planId = freePlan.id
      }
    }

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        country: validatedData.country,
        currency: validatedData.currency,
        language: validatedData.language || "pt-BR",
        role: "USER",
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    // Create subscription for the selected plan
    let plan: any = null
    if (planId) {
      plan = await prisma.plan.findUnique({
        where: { id: planId },
      })

      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // 1 month from now

      await prisma.subscription.create({
        data: {
          userId: user.id,
          planId,
          status: "active",
          startDate,
          endDate,
          nextBillingDate: endDate,
        },
      })

      // Enviar email se for plano pago (não grátis)
      if (plan && Number(plan.priceMonthly) > 0) {
        await sendRegistrationEmail({
          userName: validatedData.name,
          userEmail: validatedData.email,
          planName: plan.name,
          planDisplayName: plan.displayName,
          planPrice: plan.priceMonthly,
          userCountry: validatedData.country,
          userCurrency: validatedData.currency,
        }).catch((error) => {
          logger.error("Erro ao enviar email de registro", error instanceof Error ? error : undefined)
          // Não bloquear o registro se o email falhar
        })
      }
    }

    return NextResponse.json(
      { message: "Usuário criado com sucesso", user },
      { status: 201 }
    )
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao registrar usuário", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

