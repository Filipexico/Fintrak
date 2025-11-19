// Expense categories
export const EXPENSE_CATEGORIES = [
  "fuel",
  "insurance",
  "phone",
  "maintenance",
  "food",
  "parking",
  "tolls",
  "other",
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

// User roles
export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Common delivery platforms
export const COMMON_PLATFORMS = [
  "Uber Eats",
  "iFood",
  "99Food",
  "Keeta",
  "Wolt",
  "Glovo",
  "DoorDash",
  "Rappi",
  "PedidosYa",
  "Just Eat",
] as const

// Supported currencies
export const SUPPORTED_CURRENCIES = [
  { code: "BRL", symbol: "R$", name: "Real Brasileiro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
] as const

// Supported languages (ISO 639-1 codes with region)
export const SUPPORTED_LANGUAGES = [
  { code: "pt-BR", name: "Português (Brasil)", nativeName: "Português" },
  { code: "en-US", name: "English (US)", nativeName: "English" },
  { code: "es-ES", name: "Español (España)", nativeName: "Español" },
  { code: "es-MX", name: "Español (México)", nativeName: "Español" },
  { code: "fr-FR", name: "Français", nativeName: "Français" },
  { code: "de-DE", name: "Deutsch", nativeName: "Deutsch" },
  { code: "it-IT", name: "Italiano", nativeName: "Italiano" },
  { code: "pt-PT", name: "Português (Portugal)", nativeName: "Português" },
  { code: "ru-RU", name: "Русский", nativeName: "Русский" },
  { code: "zh-CN", name: "中文 (简体)", nativeName: "中文" },
  { code: "ja-JP", name: "日本語", nativeName: "日本語" },
  { code: "ko-KR", name: "한국어", nativeName: "한국어" },
  { code: "ar-SA", name: "العربية", nativeName: "العربية" },
  { code: "hi-IN", name: "हिन्दी", nativeName: "हिन्दी" },
  { code: "nl-NL", name: "Nederlands", nativeName: "Nederlands" },
  { code: "pl-PL", name: "Polski", nativeName: "Polski" },
  { code: "tr-TR", name: "Türkçe", nativeName: "Türkçe" },
  { code: "vi-VN", name: "Tiếng Việt", nativeName: "Tiếng Việt" },
  { code: "th-TH", name: "ไทย", nativeName: "ไทย" },
  { code: "id-ID", name: "Bahasa Indonesia", nativeName: "Bahasa Indonesia" },
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"]

// Vehicle types
export const VEHICLE_TYPES = [
  "motorbike",
  "car",
  "bike",
  "scooter",
  "other",
] as const

export type VehicleType = (typeof VEHICLE_TYPES)[number]

// Fuel types
export const FUEL_TYPES = [
  "gasoline",
  "diesel",
  "ethanol",
  "electric",
  "hybrid",
  "other",
] as const

export type FuelType = (typeof FUEL_TYPES)[number]

// Maintenance types
export const MAINTENANCE_TYPES = [
  "oil_change",
  "tire_change",
  "brake_service",
  "battery_check",
  "general",
  "other",
] as const

export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number]

export const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  oil_change: "Troca de Óleo",
  tire_change: "Troca de Pneus",
  brake_service: "Serviço de Freios",
  battery_check: "Verificação de Bateria",
  general: "Manutenção Geral",
  other: "Outro",
}
