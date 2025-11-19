import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { createExpenseSchema } from "@/lib/validations/expense"
import { handleApiError } from "@/lib/utils/errors"
import { createExpenseWhere } from "@/types/prisma"

// GET - Listar todas as despesas do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where = createExpenseWhere(userId, {
      category: category || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar nova despesa
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    const body = await request.json()
    const validatedData = createExpenseSchema.parse(body)

    const expense = await prisma.expense.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

