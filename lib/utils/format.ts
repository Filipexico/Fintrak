/**
 * Utilitários de formatação
 */

/**
 * Formata um valor monetário
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "BRL",
  options?: Intl.NumberFormatOptions
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount

  return new Intl.NumberFormat("pt-BR", {
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




