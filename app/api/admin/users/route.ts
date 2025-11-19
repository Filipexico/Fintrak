import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/utils/admin"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"
import type { Prisma } from "@prisma/client"

// GET - Listar todos os usuários
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const isActive = searchParams.get("isActive")

    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ]
    }

    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        country: true,
        currency: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            incomes: true,
            expenses: true,
            platforms: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao listar usuários", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

