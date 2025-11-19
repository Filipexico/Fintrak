import { UserRole, ExpenseCategory } from "@/lib/constants"

// Base types (from Prisma models)
export type User = {
  id: string
  email: string
  name: string
  country: string
  currency: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Platform = {
  id: string
  userId: string
  name: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Income = {
  id: string
  userId: string
  platformId: string | null
  amount: number
  currency: string
  date: Date
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export type Expense = {
  id: string
  userId: string
  category: ExpenseCategory
  amount: number
  currency: string
  date: Date
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export type TaxRule = {
  id: string
  country: string
  displayName: string
  percentage: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Re-export API types
export type {
  PlatformWithCounts,
  IncomeWithPlatform,
  ExpenseWithCategory,
  PlatformFormData,
  IncomeFormData,
  ExpenseFormData,
  PlatformListItem,
  IncomeListItem,
  ExpenseListItem,
} from "./api"

