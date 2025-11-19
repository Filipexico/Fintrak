/**
 * Utilitários de formatação
 */

/**
 * Obtém o locale apropriado baseado na moeda
 */
function getLocaleForCurrency(currency: string): string {
  const currencyLocaleMap: Record<string, string> = {
    BRL: "pt-BR",
    USD: "en-US",
    EUR: "pt-PT", // Usar pt-PT para EUR (formato europeu)
    GBP: "en-GB",
    JPY: "ja-JP",
    CNY: "zh-CN",
    INR: "en-IN",
    AUD: "en-AU",
    CAD: "en-CA",
    CHF: "de-CH",
    SEK: "sv-SE",
    NOK: "nb-NO",
    DKK: "da-DK",
    PLN: "pl-PL",
    CZK: "cs-CZ",
    HUF: "hu-HU",
    RON: "ro-RO",
    RUB: "ru-RU",
    TRY: "tr-TR",
    ZAR: "en-ZA",
    MXN: "es-MX",
    ARS: "es-AR",
    CLP: "es-CL",
    COP: "es-CO",
  }

  return currencyLocaleMap[currency] || "pt-BR"
}

/**
 * Formata um valor monetário
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "BRL",
  options?: Intl.NumberFormatOptions
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  const locale = getLocaleForCurrency(currency || "BRL")

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "BRL",
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    ...options,
  }).format(numAmount)
}

/**
 * Formata uma data para exibição
 */
export function formatDate(
  date: Date | string,
  format: "short" | "long" | "date" = "date"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  if (format === "short") {
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (format === "long") {
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  // date format (default)
  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/**
 * Converte uma data para formato de input (YYYY-MM-DD)
 */
export function dateToInputFormat(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toISOString().split("T")[0]
}

/**
 * Converte formato de input para Date
 */
export function inputFormatToDate(dateString: string): Date {
  return new Date(dateString)
}




