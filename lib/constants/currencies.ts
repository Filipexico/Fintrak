/**
 * Lista completa de moedas do mundo (ISO 4217)
 * Organizadas por continente para melhor UX
 */

export interface Currency {
  code: string
  name: string
  symbol?: string
}

export const CURRENCIES: Currency[] = [
  // América do Norte
  { code: "USD", name: "Dólar Americano", symbol: "$" },
  { code: "CAD", name: "Dólar Canadense", symbol: "C$" },
  { code: "MXN", name: "Peso Mexicano", symbol: "$" },

  // América do Sul
  { code: "BRL", name: "Real Brasileiro", symbol: "R$" },
  { code: "ARS", name: "Peso Argentino", symbol: "$" },
  { code: "CLP", name: "Peso Chileno", symbol: "$" },
  { code: "COP", name: "Peso Colombiano", symbol: "$" },
  { code: "PEN", name: "Sol Peruano", symbol: "S/" },
  { code: "UYU", name: "Peso Uruguaio", symbol: "$U" },
  { code: "VES", name: "Bolívar Venezuelano", symbol: "Bs" },

  // Europa
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£" },
  { code: "CHF", name: "Franco Suíço", symbol: "CHF" },
  { code: "SEK", name: "Coroa Sueca", symbol: "kr" },
  { code: "NOK", name: "Coroa Norueguesa", symbol: "kr" },
  { code: "DKK", name: "Coroa Dinamarquesa", symbol: "kr" },
  { code: "PLN", name: "Złoty Polonês", symbol: "zł" },
  { code: "CZK", name: "Coroa Tcheca", symbol: "Kč" },
  { code: "HUF", name: "Forint Húngaro", symbol: "Ft" },
  { code: "RON", name: "Leu Romeno", symbol: "lei" },
  { code: "BGN", name: "Lev Búlgaro", symbol: "лв" },
  { code: "HRK", name: "Kuna Croata", symbol: "kn" },
  { code: "RUB", name: "Rublo Russo", symbol: "₽" },
  { code: "TRY", name: "Lira Turca", symbol: "₺" },

  // Ásia
  { code: "CNY", name: "Yuan Chinês", symbol: "¥" },
  { code: "JPY", name: "Iene Japonês", symbol: "¥" },
  { code: "KRW", name: "Won Sul-Coreano", symbol: "₩" },
  { code: "INR", name: "Rupia Indiana", symbol: "₹" },
  { code: "IDR", name: "Rupia Indonésia", symbol: "Rp" },
  { code: "THB", name: "Baht Tailandês", symbol: "฿" },
  { code: "SGD", name: "Dólar de Singapura", symbol: "S$" },
  { code: "MYR", name: "Ringgit Malaio", symbol: "RM" },
  { code: "PHP", name: "Peso Filipino", symbol: "₱" },
  { code: "VND", name: "Dong Vietnamita", symbol: "₫" },
  { code: "HKD", name: "Dólar de Hong Kong", symbol: "HK$" },
  { code: "TWD", name: "Novo Dólar de Taiwan", symbol: "NT$" },
  { code: "PKR", name: "Rupia Paquistanesa", symbol: "₨" },
  { code: "BDT", name: "Taka de Bangladesh", symbol: "৳" },

  // Oriente Médio
  { code: "AED", name: "Dirham dos Emirados Árabes", symbol: "د.إ" },
  { code: "SAR", name: "Riyal Saudita", symbol: "﷼" },
  { code: "ILS", name: "Novo Shekel Israelense", symbol: "₪" },
  { code: "QAR", name: "Riyal do Catar", symbol: "﷼" },
  { code: "KWD", name: "Dinar do Kuwait", symbol: "د.ك" },

  // África
  { code: "ZAR", name: "Rand Sul-Africano", symbol: "R" },
  { code: "EGP", name: "Libra Egípcia", symbol: "£" },
  { code: "NGN", name: "Naira Nigeriana", symbol: "₦" },
  { code: "KES", name: "Xelim Queniano", symbol: "KSh" },
  { code: "GHS", name: "Cedi Ganês", symbol: "GH₵" },

  // Oceania
  { code: "AUD", name: "Dólar Australiano", symbol: "A$" },
  { code: "NZD", name: "Dólar Neozelandês", symbol: "NZ$" },
]

// Ordenar alfabeticamente por código para facilitar busca
export const CURRENCIES_SORTED = [...CURRENCIES].sort((a, b) =>
  a.code.localeCompare(b.code)
)

