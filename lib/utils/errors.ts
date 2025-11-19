import { ZodError } from "zod"
import { logger } from "@/lib/logger"

/**
 * Tipos de erro customizados
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public zodError?: ZodError) {
    super(message, "VALIDATION_ERROR", 400, zodError?.errors)
    this.name = "ValidationError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} com id ${id} não encontrado` : `${resource} não encontrado`,
      "NOT_FOUND",
      404
    )
    this.name = "NotFoundError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Não autorizado") {
    super(message, "UNAUTHORIZED", 401)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acesso negado") {
    super(message, "FORBIDDEN", 403)
    this.name = "ForbiddenError"
  }
}

/**
 * Trata erros e retorna resposta apropriada
 */
export function handleApiError(error: unknown): {
  message: string
  statusCode: number
  details?: unknown
} {
  if (error instanceof AppError) {
    logger.error(error.message, error, {
      code: error.code,
      statusCode: error.statusCode,
    })
    return {
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    }
  }

  if (error instanceof ZodError) {
    logger.warn("Validation error", { errors: error.errors })
    return {
      message: "Dados inválidos",
      statusCode: 400,
      details: error.errors,
    }
  }

  if (error instanceof Error) {
    logger.error("Unexpected error", error)
    return {
      message: error.message || "Erro interno do servidor",
      statusCode: 500,
    }
  }

  logger.error("Unknown error", undefined, { error })
  return {
    message: "Erro interno do servidor",
    statusCode: 500,
  }
}



