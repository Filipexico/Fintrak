/**
 * Utilitários para conversão de moedas
 */

// Cache de taxas de câmbio (válido por 1 hora)
let exchangeRatesCache: {
  rates: Record<string, number>
  base: string
  timestamp: number
} | null = null

const CACHE_DURATION = 60 * 60 * 1000 // 1 hora em milissegundos

/**
 * Busca taxas de câmbio atualizadas (usando ExchangeRate-API gratuita)
 * Fallback para taxas fixas se a API falhar
 */
async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Verificar cache
  if (
    exchangeRatesCache &&
    Date.now() - exchangeRatesCache.timestamp < CACHE_DURATION
  ) {
    return exchangeRatesCache.rates
  }

  try {
    // Usando ExchangeRate-API (gratuita, sem chave necessária)
    // Tentar primeiro com EUR como base
    let response = await fetch("https://api.exchangerate-api.com/v4/latest/EUR", {
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()
      const rates: Record<string, number> = {}

      // A API retorna taxas com EUR como base (ex: rates.USD = quanto USD por 1 EUR)
      // Para converter de qualquer moeda para EUR, precisamos inverter
      // Se 1 EUR = X USD, então 1 USD = 1/X EUR
      Object.entries(data.rates).forEach(([currency, rate]) => {
        rates[currency] = 1 / (rate as number) // Inverter para ter EUR como base
      })
      rates.EUR = 1 // EUR para EUR = 1

      // Atualizar cache
      exchangeRatesCache = {
        rates,
        base: "EUR",
        timestamp: Date.now(),
      }

      return rates
    }

    // Fallback: tentar com USD como base e converter
    response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()
      const rates: Record<string, number> = {}
      const eurRate = data.rates.EUR || 0.92 // Taxa USD -> EUR

      // Converter todas as moedas para EUR
      Object.entries(data.rates).forEach(([currency, rate]) => {
        if (currency === "EUR") {
          rates.EUR = 1
        } else {
          // Converter: (1 / rate) * eurRate = eurRate / rate
          rates[currency] = eurRate / (rate as number)
        }
      })
      rates.USD = eurRate
      rates.EUR = 1

      exchangeRatesCache = {
        rates,
        base: "EUR",
        timestamp: Date.now(),
      }

      return rates
    }
  } catch (error) {
    console.warn("Erro ao buscar taxas de câmbio da API, usando taxas fixas", error)
  }

  // Fallback: taxas fixas aproximadas (atualizadas manualmente quando necessário)
  const fallbackRates: Record<string, number> = {
    EUR: 1,
    BRL: 0.18, // 1 EUR ≈ 5.5 BRL
    USD: 0.92, // 1 EUR ≈ 1.09 USD
    GBP: 1.17, // 1 EUR ≈ 0.85 GBP
  }

  return fallbackRates
}

/**
 * Converte um valor de uma moeda para EUR
 */
export async function convertToEUR(
  amount: number,
  fromCurrency: string
): Promise<number> {
  if (fromCurrency === "EUR") {
    return amount
  }

  const rates = await fetchExchangeRates()
  const rate = rates[fromCurrency.toUpperCase()] || 1

  return amount * rate
}

/**
 * Converte múltiplos valores para EUR
 */
export async function convertMultipleToEUR(
  amounts: Array<{ amount: number; currency: string }>
): Promise<number> {
  const conversions = await Promise.all(
    amounts.map((item) => convertToEUR(item.amount, item.currency))
  )

  return conversions.reduce((sum, value) => sum + value, 0)
}

/**
 * Formata valor em EUR
 */
export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Obtém taxa de câmbio atual (para exibição)
 */
export async function getExchangeRate(fromCurrency: string, toCurrency: string = "EUR"): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1
  }

  const rates = await fetchExchangeRates()
  const fromRate = rates[fromCurrency.toUpperCase()] || 1
  const toRate = rates[toCurrency.toUpperCase()] || 1

  // Se ambas são para EUR, retornar a taxa direta
  if (toCurrency === "EUR") {
    return fromRate
  }

  // Converter via EUR
  return fromRate / toRate
}

