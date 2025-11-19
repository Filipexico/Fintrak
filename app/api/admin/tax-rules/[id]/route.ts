import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { z } from "zod"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

const updateTaxRuleSchema = z.object({
  displayName: z.string().min(1).optional(),
  percentage: z.number().min(0).max(1).optional(),
  isActive: z.boolean().optional(),
})

// GET - Obter tax rule específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const taxRule = await prisma.taxRule.findUnique({
      where: { id: params.id },
    })

    if (!taxRule) {
      return NextResponse.json(
        { error: "Tax rule não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(taxRule)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter tax rule", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar tax rule
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = updateTaxRuleSchema.parse(body)

    const taxRule = await prisma.taxRule.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(taxRule)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar tax rule", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar tax rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    await prisma.taxRule.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Tax rule deletada com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar tax rule", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

