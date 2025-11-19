"use client"

import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { locales, type Locale } from "@/i18n/config"
import { Button } from "@/components/ui/button"

const localeNames: Record<Locale, string> = {
  "pt-BR": "PT",
  en: "EN",
  de: "DE",
  zh: "中文",
}

export function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale() as Locale

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    let pathWithoutLocale = pathname
    
    // Find and remove the current locale prefix
    for (const loc of locales) {
      if (pathWithoutLocale.startsWith(`/${loc}`)) {
        pathWithoutLocale = pathWithoutLocale.replace(`/${loc}`, "")
        break
      }
    }
    
    // If no locale was found in pathname, use the current path as-is
    if (pathWithoutLocale === pathname) {
      // Check if it's a root path
      if (pathWithoutLocale === "/") {
        pathWithoutLocale = ""
      }
    }
    
    // Ensure path starts with / if not empty
    if (pathWithoutLocale && !pathWithoutLocale.startsWith("/")) {
      pathWithoutLocale = `/${pathWithoutLocale}`
    }
    
    // Build new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale || ""}`
    router.push(newPath)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc) => (
        <Button
          key={loc}
          variant={currentLocale === loc ? "default" : "ghost"}
          size="sm"
          onClick={() => switchLocale(loc)}
          className="min-w-[40px]"
        >
          {localeNames[loc]}
        </Button>
      ))}
    </div>
  )
}



