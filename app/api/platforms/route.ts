import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { createPlatformSchema } from "@/lib/validations/platform"
import { handleApiError, ValidationError, NotFoundError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"
import { createPlatformWhere } from "@/types/prisma"

// GET - Listar todas as plataformas do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    const platforms = await prisma.platform.findMany({
      where: createPlatformWhere(userId),
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(platforms)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// POST - Criar nova plataforma
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar limite de plataformas do plano do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: "active",
          },
          include: {
            plan: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Contar plataformas ativas do usuário
    const activePlatformsCount = await prisma.platform.count({
      where: {
        userId,
        isActive: true,
      },
    })

    // Obter limite do plano
    const activeSubscription = user.subscriptions[0]
    const plan = activeSubscription?.plan
    const maxPlatforms = plan?.maxPlatforms

    // Verificar se excedeu o limite (null = unlimited)
    if (maxPlatforms !== null && activePlatformsCount >= maxPlatforms) {
      return NextResponse.json(
        {
          error: "Limite de plataformas atingido",
          details: {
            current: activePlatformsCount,
            max: maxPlatforms,
            plan: plan?.displayName || "Free",
            upgradeRequired: true,
          },
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createPlatformSchema.parse(body)

    // Verificar se já existe plataforma com mesmo nome para o usuário
    const existing = await prisma.platform.findFirst({
      where: {
        userId,
        name: validatedData.name,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma plataforma com este nome" },
        { status: 400 }
      )
    }

    const platform = await prisma.platform.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json(platform, { status: 201 })
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

