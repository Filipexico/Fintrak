import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/utils/errors"
import { logger } from "@/lib/logger"

// Verificar se já existe um admin no sistema
export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    })

    return NextResponse.json({ hasAdmin: adminCount > 0 })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)
    logger.error("Erro ao verificar setup", error instanceof Error ? error : undefined)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}



