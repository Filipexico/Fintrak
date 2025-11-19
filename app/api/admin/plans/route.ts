import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { createPlanSchema } from "@/lib/validations/plan"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Listar todos os planos
export async function GET() {
  try {
    await requireAdmin()

    const plans = await prisma.plan.findMany({
      orderBy: { priceMonthly: "asc" },
    })

    return NextResponse.json(plans)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar planos", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar novo plano
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createPlanSchema.parse(body)

    // Verificar se já existe plano com mesmo nome
    const existing = await prisma.plan.findUnique({
      where: { name: validatedData.name },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Já existe um plano com este nome" },
        { status: 400 }
      )
    }

    const plan = await prisma.plan.create({
      data: validatedData,
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao criar plano", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}



