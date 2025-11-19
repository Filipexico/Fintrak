import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { setupAdminSchema } from "@/lib/validations/admin"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// Criar primeiro admin (setup inicial)
export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Já existe um administrador no sistema" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = setupAdminSchema.parse(body)

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Criar admin
    const admin = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name || "Administrador",
        country: "BR",
        currency: "BRL",
        role: "ADMIN",
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    logger.info("Admin criado via setup inicial", { email: admin.email })

    return NextResponse.json(
      { message: "Conta admin criada com sucesso", user: admin },
      { status: 201 }
    )
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error)
    logger.error("Erro ao criar admin via setup", error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: statusCode }
    )
  }
}



