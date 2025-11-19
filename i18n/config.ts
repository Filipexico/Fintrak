export const locales = ["pt-BR", "en", "de", "zh"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"



