import { Prisma } from "@prisma/client"

// Prisma Where Types
export type IncomeWhereInput = Prisma.IncomeWhereInput
export type ExpenseWhereInput = Prisma.ExpenseWhereInput
export type PlatformWhereInput = Prisma.PlatformWhereInput
export type UserWhereInput = Prisma.UserWhereInput
export type UsageLogWhereInput = Prisma.UsageLogWhereInput

// Helper para criar where clauses tipadas
export function createIncomeWhere(userId: string, filters?: {
  platformId?: string
  startDate?: Date
  endDate?: Date
}): IncomeWhereInput {
  const where: IncomeWhereInput = { userId }

  if (filters?.platformId) {
    where.platformId = filters.platformId
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {}
    if (filters.startDate) {
      where.date.gte = filters.startDate
    }
    if (filters.endDate) {
      where.date.lte = filters.endDate
    }
  }

  return where
}

export function createExpenseWhere(userId: string, filters?: {
  category?: string
  startDate?: Date
  endDate?: Date
}): ExpenseWhereInput {
  const where: ExpenseWhereInput = { userId }

  if (filters?.category) {
    where.category = filters.category as Prisma.EnumExpenseCategoryFilter
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {}
    if (filters.startDate) {
      where.date.gte = filters.startDate
    }
    if (filters.endDate) {
      where.date.lte = filters.endDate
    }
  }

  return where
}

export function createPlatformWhere(userId: string, filters?: {
  isActive?: boolean
}): PlatformWhereInput {
  const where: PlatformWhereInput = { userId }

  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive
  }

  return where
}

export function createUsageLogWhere(userId: string, filters?: {
  startDate?: Date
  endDate?: Date
  vehicleId?: string
}): UsageLogWhereInput {
  const where: UsageLogWhereInput = { userId }

  if (filters?.startDate || filters?.endDate) {
    where.date = {}
    if (filters.startDate) {
      where.date.gte = filters.startDate
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate)
      end.setHours(23, 59, 59, 999)
      where.date.lte = end
    }
  }

  if (filters?.vehicleId) {
    where.vehicleId = filters.vehicleId
  }

  return where
}

