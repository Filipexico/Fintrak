import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"
import { locales, defaultLocale, type Locale } from "./config"

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = (locale || defaultLocale) as Locale
  if (!locales.includes(validLocale)) notFound()

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  }
})

