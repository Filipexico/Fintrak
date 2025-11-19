import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUserId } from "@/lib/utils/auth"
import { updatePlatformSchema } from "@/lib/validations/platform"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// GET - Obter plataforma específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    const platform = await prisma.platform.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
    })

    if (!platform) {
      return NextResponse.json(
        { error: "Plataforma não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(platform)
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao obter plataforma", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

// PUT - Atualizar plataforma
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()
    const body = await request.json()
    const validatedData = updatePlatformSchema.parse(body)

    // Verificar se a plataforma existe e pertence ao usuário
    const existing = await prisma.platform.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Plataforma não encontrada" },
        { status: 404 }
      )
    }

    // Se está atualizando o nome, verificar duplicatas
    if (validatedData.name && validatedData.name !== existing.name) {
      const duplicate = await prisma.platform.findFirst({
        where: {
          userId,
          name: validatedData.name,
          id: { not: params.id },
        },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: "Já existe uma plataforma com este nome" },
          { status: 400 }
        )
      }
    }

    // Filtrar apenas campos permitidos (prevenir mass assignment)
    const { name, isActive } = validatedData
    const updateData = {
      ...(name !== undefined && { name }),
      ...(isActive !== undefined && { isActive }),
      // userId NUNCA é incluído - prevenção de mass assignment
    }

    // Incluir userId no where para prevenir race conditions
    const platform = await prisma.platform.update({
      where: { 
        id: params.id,
        userId, // Garante atomicidade e previne race conditions
      },
      data: updateData,
    })

    return NextResponse.json(platform)
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao atualizar plataforma", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}

// DELETE - Deletar plataforma (soft delete via isActive)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthenticatedUserId()

    // Verificar se a plataforma existe e pertence ao usuário
    const existing = await prisma.platform.findFirst({
      where: {
        id: params.id,
        userId, // Isolamento multi-tenant
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Plataforma não encontrada" },
        { status: 404 }
      )
    }

    // Soft delete - desativar
    // Incluir userId no where para garantir que apenas o dono pode desativar
    const platform = await prisma.platform.update({
      where: { 
        id: params.id,
        userId, // Garante atomicidade
      },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Plataforma desativada com sucesso" })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao deletar plataforma", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

