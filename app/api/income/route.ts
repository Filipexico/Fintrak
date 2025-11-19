import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { createIncomeSchema } from "@/lib/validations/income"
import { handleApiError, NotFoundError } from "@/lib/utils/errors"
import { createIncomeWhere } from "@/types/prisma"

// GET - Listar todas as receitas do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    const { searchParams } = new URL(request.url)
    const platformId = searchParams.get("platformId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where = createIncomeWhere(userId, {
      platformId: platformId || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })

    const incomes = await prisma.income.findMany({
      where,
      include: {
        platform: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(incomes)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar nova receita
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    const body = await request.json()
    const validatedData = createIncomeSchema.parse(body)

    // Se platformId foi fornecido, verificar se pertence ao usuário
    if (validatedData.platformId) {
      const platform = await prisma.platform.findFirst({
        where: {
          id: validatedData.platformId,
          userId, // Isolamento multi-tenant
        },
      })

      if (!platform) {
        return NextResponse.json(
          { error: "Plataforma não encontrada" },
          { status: 404 }
        )
      }
    }

    const income = await prisma.income.create({
      data: {
        ...validatedData,
        platformId: validatedData.platformId || null,
        date: new Date(validatedData.date),
        userId,
      },
      include: {
        platform: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

