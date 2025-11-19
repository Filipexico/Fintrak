import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { z } from "zod"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

const createTaxRuleSchema = z.object({
  country: z.string().length(2, "Código do país deve ter 2 caracteres"),
  displayName: z.string().min(1, "Nome é obrigatório"),
  percentage: z.number().min(0).max(1, "Porcentagem deve estar entre 0 e 1"),
  isActive: z.boolean().optional().default(true),
})

const updateTaxRuleSchema = createTaxRuleSchema.partial()

// GET - Listar todas as tax rules
export async function GET() {
  try {
    await requireAdmin()

    const taxRules = await prisma.taxRule.findMany({
      orderBy: { country: "asc" },
    })

    return NextResponse.json(taxRules)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar tax rules", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar nova tax rule
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createTaxRuleSchema.parse(body)

    // Verificar se já existe regra para o país
    const existing = await prisma.taxRule.findUnique({
      where: { country: validatedData.country },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma regra fiscal para este país" },
        { status: 400 }
      )
    }

    const taxRule = await prisma.taxRule.create({
      data: validatedData,
    })

    return NextResponse.json(taxRule, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao criar tax rule", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

