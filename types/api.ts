import { Platform, Income, Expense } from "./index"
import { ExpenseCategory } from "@/lib/constants"

// API Response Types
export type ApiError = {
  error: string
  details?: unknown
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  details?: unknown
}

// Platform API Types
export type PlatformWithCounts = Platform & {
  _count?: {
    incomes: number
    expenses: number
    platforms: number
  }
}

// Income API Types
export type IncomeWithPlatform = Income & {
  platform: {
    id: string
    name: string
  } | null
}

// Expense API Types
export type ExpenseWithCategory = Expense & {
  category: ExpenseCategory
}

// Form Types (for client-side)
export type PlatformFormData = {
  name: string
  isActive?: boolean
}

export type IncomeFormData = {
  platformId: string | null
  amount: number
  currency: string
  date: string
  description?: string | null
}

export type ExpenseFormData = {
  category: ExpenseCategory
  amount: number
  currency: string
  date: string
  description?: string | null
}

// List Types (for client-side with serialized dates)
export type PlatformListItem = Omit<Platform, "createdAt" | "updatedAt"> & {
  createdAt: string
  updatedAt: string
}

export type IncomeListItem = Omit<Income, "date" | "createdAt" | "updatedAt"> & {
  platform: {
    id: string
    name: string
  } | null
  date: string
  createdAt: string
  updatedAt: string
}

export type ExpenseListItem = Omit<Expense, "date" | "createdAt" | "updatedAt"> & {
  date: string
  createdAt: string
  updatedAt: string
}



